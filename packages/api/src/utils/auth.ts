import { sign, verify } from "jsonwebtoken";
import { hash, compare } from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET) as { id: string };
  } catch (error) {
    return null;
  }
}
