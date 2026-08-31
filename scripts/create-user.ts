/**
 * Creates an account. There is no public signup route, so this is the only way
 * one comes into existence.
 *
 *   npm run user:create
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Client } from "pg";
import { hashPassword } from "../src/lib/password";

/** Reads a line without echoing it back to the terminal. */
async function askSecret(prompt: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout, terminal: true });

  // readline writes each keystroke to the output; swallowing everything after
  // the prompt is what keeps the password off the screen.
  let muted = false;
  const original = Object.getPrototypeOf(rl)._writeToOutput;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (rl as any)._writeToOutput = function (text: string) {
    if (!muted) original.call(this, text);
  };

  const answer = rl.question(prompt);
  muted = true;

  try {
    return await answer;
  } finally {
    muted = false;
    rl.close();
    stdout.write("\n");
  }
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }

  const rl = createInterface({ input: stdin, output: stdout });
  const email = (await rl.question("Email: ")).trim().toLowerCase();
  const displayName = (await rl.question("Display name: ")).trim();
  rl.close();

  if (!email || !displayName) throw new Error("Email and display name are required.");

  const password = await askSecret("Password: ");
  const confirm = await askSecret("Confirm password: ");

  if (password !== confirm) throw new Error("Those passwords do not match.");
  if (password.length < 12) {
    throw new Error("Use at least 12 characters — this account can upload.");
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
    const message = (error as { code?: string }).code === "23505"
      ? `${email} already has an account.`
      : (error as Error).message;
    throw new Error(message);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
