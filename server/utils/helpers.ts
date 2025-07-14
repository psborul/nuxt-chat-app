import crypto from 'crypto';

export const uuid = () => {
  return Date.now().toString()
};

export function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.randomBytes(16).toString('hex'); // 16-byte salt

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100_000, 64, 'sha512', (err, derivedKey) => {
      if (err) return reject(err);
      resolve({
        salt,
        hash: derivedKey.toString('hex'),
      });
    });
  });
}

export function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100_000, 64, 'sha512', (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey.toString('hex') === hash);
    });
  });
}

