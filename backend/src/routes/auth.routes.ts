// rotas de autenticação: login e registro
import { Router, type Request, type Response } from 'express'
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signJwt } from '../core/jwt'

const prisma = new PrismaClient()
export const router = Router()

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  // validações simples de campos obrigatórios
  let { name, email, password, phone } = req.body as { name?: string; email?: string; password?: string; phone?: string }
  email = (email ?? '').trim().toLowerCase()
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' })
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(409).json({ message: 'Email já cadastrado.' })

  const password_hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, phone, password_hash, role: UserRole.CLIENTE }
  })

  return res.status(201).json({ id: user.id, name: user.name, email: user.email })
})

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  let { email, password } = req.body as { email?: string; password?: string }
  email = (email ?? '').trim().toLowerCase()
  if (!email || !password) return res.status(400).json({ message: 'Credenciais inválidas.' })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ message: 'Usuário não encontrado.' })

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return res.status(401).json({ message: 'Senha incorreta.' })

  const token = signJwt({ sub: user.id, role: user.role })

  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})