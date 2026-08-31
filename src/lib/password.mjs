import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const SCHEME = "scrypt";
const SALT_BYTES = 16;
const KEY_BYTES = 64;

/**
 * Password hashing built on `node:crypto`.
 *
 * @param {string} password
 * @returns {Promise<string>} `scrypt$<salt hex>$<derived key hex>`
 */
export async function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES);
  const derived = await scryptAsync(password.normalize("NFKC"), salt, KEY_BYTES);

  return `${SCHEME}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

/**
 * Constant-time check of a password against a stored hash.
 *
 * @param {string} password
 * @param {string} stored
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, stored) {
  const [scheme, saltHex, keyHex] = stored.split("$");
  if (scheme !== SCHEME || !saltHex || !keyHex) return false;

  const expected = Buffer.from(keyHex, "hex");
  const derived = await scryptAsync(
    password.normalize("NFKC"),
    Buffer.from(saltHex, "hex"),
    expected.length,
  );

  // Lengths always match here, but timingSafeEqual throws if they ever do not.
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}
