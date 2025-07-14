import type { H3Event } from 'h3'
import UserRepository from '~/server/repository/UserRepository'
import { signToken } from '~/server/utils/jwt'
import { verifyPassword } from '~/server/utils/helpers'

type RequestBody = {
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
  const { email, password } = await readBody<RequestBody>(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
  }

  const user = UserRepository.findByEmail(email)
  if (!user) {
    throw createError({
      statusCode: 409,
      statusMessage: 'There is no registered user with this email',
    })
  }

  const isValid = await verifyPassword(
    password,
    user.passwordHash,
    user.passwordSalt
  )

  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid password' })
  }

  const token = signToken({ id: user.id, email: user.email })

  return {
    token,
    id: user.id,
    email: user.email,
    username: user.username,
  }
})

//TODO: maybe to use cookie