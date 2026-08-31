import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const SCHEME = "scrypt";
const SALT_BYTES = 16;
const KEY_BYTES = 64;

/**
 * Password hashing built on `node:crypto`.
 *
 * scrypt is memory-hard and ships with Node, so there is no native module to
 * compile on the VPS — which is the usual reason bcrypt/argon2 installs break
 * on deploy.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = (await scryptAsync(
    password.normalize("NFKC"),
    salt,
    KEY_BYTES,
  )) as Buffer;

  return `${SCHEME}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

/** Constant-time check of a password against a stored hash. */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, saltHex, keyHex] = stored.split("$");
  if (scheme !== SCHEME || !saltHex || !keyHex) return false;

  const expected = Buffer.from(keyHex, "hex");
  const derived = (await scryptAsync(
    password.normalize("NFKC"),
    Buffer.from(saltHex, "hex"),
    expected.length,
  )) as Buffer;

  // Lengths always match here, but timingSafeEqual throws if they ever do not.
  return (
    derived.length === expected.length && timingSafeEqual(derived, expected)
  );
}
