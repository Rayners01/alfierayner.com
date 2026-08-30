/**
 * One-off helper to mint a Spotify refresh token for the now-playing tile.
 *
 * Refresh tokens do not expire, so this only needs running when the token is
 * revoked or the client secret is rotated.
 *
 *   npm run spotify:token
 *
 * Reads SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET from .env, runs the
 * authorization-code flow against a throwaway loopback server, and prints the
 * refresh token to paste back into .env.
 *
 * The redirect URI below must be registered on the app at
 * https://developer.spotify.com/dashboard, character for character. Spotify
 * requires HTTPS for redirect URIs except on loopback addresses, and rejects
 * the hostname `localhost` — it must be the 127.0.0.1 literal.
 */

import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";

const PORT = 3000;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/api/callback`;

/** Derived, never hardcoded — the two must agree or the callback 404s. */
const CALLBACK_PATH = new URL(REDIRECT_URI).pathname;

/** Everything src/lib/spotify.ts calls, and nothing more. */
const SCOPES = ["user-read-currently-playing", "user-read-recently-played"];

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET.\n" +
      "Set them in .env, then run: npm run spotify:token",
  );
  process.exit(1);
}

const state = randomBytes(16).toString("hex");

const authorizeUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: REDIRECT_URI,
  scope: SCOPES.join(" "),
  state,
  // Always show the consent screen, so re-running actually re-issues a token.
  show_dialog: "true",
})}`;

/** Swaps the one-time authorization code for a long-lived refresh token. */
async function exchange(code) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.refresh_token) {
    throw new Error(
      `Token exchange failed (${res.status}): ${data.error_description ?? data.error ?? "unknown error"}`,
    );
  }

  return data.refresh_token;
}

function reply(res, status, message) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== CALLBACK_PATH) return reply(res, 404, "Not found");

  const error = url.searchParams.get("error");
  if (error) {
    reply(res, 400, `Authorization denied: ${error}`);
    console.error(`\nAuthorization denied: ${error}`);
    server.close();
    process.exitCode = 1;
    return;
  }

  // Guards against a callback that did not originate from our authorize URL.
  if (url.searchParams.get("state") !== state) {
    reply(res, 400, "State mismatch — ignoring this callback.");
    return;
  }

  try {
    const refreshToken = await exchange(url.searchParams.get("code"));
    reply(res, 200, "Done. You can close this tab and return to the terminal.");

    console.log("\nAdd this to .env:\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${refreshToken}\n`);
  } catch (err) {
    reply(res, 500, err.message);
    console.error(`\n${err.message}`);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

// Port 3000 is also the `next dev` port, so this collision is easy to hit.
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use — stop \`npm run dev\` and try again.\n` +
        "(Or change PORT here and register the matching redirect URI on the app.)",
    );
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Redirect URI (must be registered on the app): ${REDIRECT_URI}\n`);
  console.log("Opening Spotify authorization. If nothing opens, visit:\n");
  console.log(`${authorizeUrl}\n`);

  const open =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";

  spawn(open, [authorizeUrl], { stdio: "ignore", detached: true }).unref();
});
