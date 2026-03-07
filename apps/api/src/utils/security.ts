import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const hashToken = (rawToken: string) =>
  createHash("sha256").update(rawToken).digest("hex");

export const generateToken = (bytes = 32) => randomBytes(bytes).toString("hex");

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

export const verifyPassword = (password: string, passwordHash: string) => {
  const [salt, storedHash] = passwordHash.split(":");
  if (!salt || !storedHash) return false;
  const computedHash = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(computedHash, "hex"));
};
