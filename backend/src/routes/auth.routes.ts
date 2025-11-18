// rotas de autenticação: login e registro
import { Router, type Request, type Response } from 'express'
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signJwt } from '../core/jwt'
import { validateBody } from '../core/validate'
import { registerSchema, loginSchema } from '../validation/auth.schemas'
import { sendError, sendSuccess } from '../core/responses'

const prisma = new PrismaClient()
export const router = Router()

// POST /api/auth/register

router.post('/register', validateBody(registerSchema), async (req: Request, res: Response) => {
  // validações simples de campos obrigatórios
  const { name, email, password, phone } = req.body as { name: string; email: string; password: string; phone?: string }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return sendError(res, 'Email já cadastrado.', 409)

  const password_hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, phone, password_hash, role: UserRole.CLIENTE }
  })

  return sendSuccess(res, { id: user.id, name: user.name, email: user.email }, 201)
})

// POST /api/auth/login

router.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return sendError(res, 'Usuário não encontrado.', 401)

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return sendError(res, 'Senha incorreta.', 401)

  const token = signJwt({ sub: user.id, role: user.role })

  return sendSuccess(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})