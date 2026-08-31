import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Client } from "pg";
import { hashPassword } from "../src/lib/password.mjs";

const MIN_PASSWORD_LENGTH = 12;

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
