import UserRepository from '~/repository/UserRepository';
import { hashPassword } from '~/utils/helpers';
import { signToken } from '~/utils/jwt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return sendError(event, createError({ statusCode: 400, message: 'Missing fields' }));
  }

  const existing = UserRepository.findByEmail(email);
  if (existing) {
    //TODO: Maybe to rework this for error messages
    return sendError(event, createError({ statusCode: 409, statusMessage: 'Email already taken' }));
  }

  const { hash, salt } = await hashPassword(password);

  const newUser = UserRepository.create({
    username,
    email,
    passwordHash: hash,
    passwordSalt: salt,
    online: false
  });

  const token = signToken({ id: newUser.id, email: newUser.email, username: newUser.username });

  return {
    token,
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  };
});
