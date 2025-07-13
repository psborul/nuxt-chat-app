// import { signToken } from '~/server/utils/jwt';
// import { verifyPassword } from '~/server/utils/password';

// const users = [
//   {
//     id: 1,
//     email: 'user@example.com',
//     passwordHash: '...',
//     passwordSalt: '...',
//     name: 'Demo User'
//   }
// ];

// export default defineEventHandler(async (event) => {
//   const { email, password } = await readBody(event);
//   const user = users.find((u) => u.email === email);
//   if (!user) return { error: 'User not found' };

//   const isValid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
//   if (!isValid) return { error: 'Invalid password' };

//   const token = signToken({ id: user.id, email: user.email });

//   return { token, user: { id: user.id, email: user.email, name: user.name } };

//   // Option 2 (for SSR): Set cookie
//   // setCookie(event, 'auth_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
//   // return { user: { id: user.id, email: user.email } };
// });
