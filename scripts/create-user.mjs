/**
 * Creates an account. There is no public signup route, so this is the only way
 * one comes into existence.
 *
 * Interactively:
 *   npm run user:create
 *
 * Non-interactively (CI, or a scripted VPS provision) — the password is read
 * from stdin rather than an environment variable, so it stays out of the
 * process table and the shell history:
 *   USER_EMAIL=me@example.com USER_NAME="Me" \
 *     node --env-file=.env scripts/create-user.mjs < password.txt
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Client } from "pg";
import { hashPassword } from "../src/lib/password.mjs";

const MIN_PASSWORD_LENGTH = 12;

/** Prompts on a terminal, masking the password as it is typed. */
async function askInteractively() {
  const rl = createInterface({ input: stdin, output: stdout });

  let muted = false;
  const echo = rl._writeToOutput?.bind(rl);
  if (echo) {
    rl._writeToOutput = (text) => {
      if (!muted) echo(text);
    };
  }

  async function askSecret(prompt) {
    // `question` writes the prompt first; muting from here swallows only the
    // keystrokes that follow.
    const answer = rl.question(prompt);
    muted = true;
    try {
      return await answer;
    } finally {
      muted = false;
      stdout.write("\n");
    }
  }

  try {
    const email = (await rl.question("Email: ")).trim().toLowerCase();
    const displayName = (await rl.question("Display name: ")).trim();
    const password = await askSecret("Password: ");
    const confirm = await askSecret("Confirm password: ");

    if (password !== confirm) throw new Error("Those passwords do not match.");

    return { email, displayName, password };
  } finally {
    rl.close();
  }
}

/**
 * Reads the whole of stdin as the password.
 *
 * Sequential `readline.question` calls cannot be used here: over a pipe every
 * line arrives in one chunk, only the pending question consumes one, and the
 * rest are dropped before stdin closes.
 */
async function readFromEnvAndStdin() {
  const email = (process.env.USER_EMAIL ?? "").trim().toLowerCase();
  const displayName = (process.env.USER_NAME ?? "").trim();

  if (!email || !displayName) {
    throw new Error(
      "stdin is not a terminal, so USER_EMAIL and USER_NAME must be set and " +
        "the password piped in. See the header of this file.",
    );
  }

  let password = "";
  stdin.setEncoding("utf8");
  for await (const chunk of stdin) password += chunk;

  return { email, displayName, password: password.trim() };
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }

  const { email, displayName, password } = stdin.isTTY
    ? await askInteractively()
    : await readFromEnvAndStdin();

  if (!email || !displayName) {
    throw new Error("Email and display name are required.");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `Use at least ${MIN_PASSWORD_LENGTH} characters — this account can upload.`,
    );
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query(
      `insert into users (email, display_name, password_hash) values ($1, $2, $3)`,
      [email, displayName, await hashPassword(password)],
    );
    console.log(`Created ${email}.`);
  } catch (error) {
    throw new Error(
      error.code === "23505"
        ? `${email} already has an account.`
        : error.message,
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
