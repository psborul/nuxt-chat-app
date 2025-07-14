import type { H3Event } from 'h3'
import UserRepository from '~/server/repository/UserRepository'
import { hashPassword } from '~/server/utils/helpers'
import { signToken } from '~/server/utils/jwt'

type RequestBody = {
  username: string
  email: string
  password: string
}

type Response = {
  token: string
  id: string
  email: string
  username: string
}

export default defineEventHandler(async (event: H3Event): Promise<Response> => {
  const body = await readBody<RequestBody>(event)

  const { username, email, password } = body

  if (!username || !email || !password) {
    throw createError({ statusCode: 400, message: 'Missing fields' })
  }

  const existingEmail = UserRepository.findByEmail(email)
  if (existingEmail) {
    throw createError({ statusCode: 409, statusMessage: 'Email already taken' })
  }

  const existingUsername = UserRepository.findByUsername(username)
  if (existingUsername) {
    throw createError({ statusCode: 409, statusMessage: 'Username already taken' })
  }

  const { hash, salt } = await hashPassword(password)

  const newUser = UserRepository.create({
    username,
    email,
    passwordHash: hash,
    passwordSalt: salt,
    online: false
  })

  const token = signToken({
    id: newUser.id,
    email: newUser.email,
    username: newUser.username
  })

  return {
    token,
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  }
})
