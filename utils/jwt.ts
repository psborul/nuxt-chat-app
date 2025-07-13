import jwt from 'jsonwebtoken';

const SECRET = 'your-secret-key'; // use env var in prod

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any | null {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}