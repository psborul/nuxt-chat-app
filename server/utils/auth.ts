import type { H3Event } from 'h3';
import { getHeader, createError } from 'h3';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '~/server/utils/jwt';

export function getUserFromToken(event: H3Event): { id: string } {
  const authHeader = getHeader(event, 'authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    if (!decoded?.id) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid token payload' });
    }
    return decoded;
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Invalid token' });
  }
}
