// rotas de usuários
import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { verifyUser, isAdmin, isRoot } from '../core/auth'

const prisma = new PrismaClient()
export const router = Router()

// GET /api/users/me - retorna dados do usuário autenticado
router.get('/me', verifyUser, async (req: Request, res: Response) => {
  const id = req.user?.id
  if (!id) return res.status(401).json({ message: 'Não autenticado.' })
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' })
  return res.json({ id: user.id, name: user.name, email: user.email, role: user.role })
})

// GET /api/users - admin lista usuários com paginação simples
router.get('/', verifyUser, isAdmin, async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1)
  const pageSize = Math.min(Number(req.query.pageSize || 10), 50)
  const skip = (page - 1) * pageSize

  const where = { is_active: true } as const
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, skip, take: pageSize, orderBy: { created_at: 'desc' } })
  ])

  return res.json({ page, pageSize, total, users })
})

// PATCH /api/users/:id/role - root altera role de qualquer um
router.patch('/:id/role', verifyUser, isRoot, async (req: Request, res: Response) => {
  const { id } = req.params
  const { role } = req.body
  if (!['CLIENTE', 'ADMIN', 'ROOT'].includes(role)) return res.status(400).json({ message: 'Role inválida.' })
  // regra de segurança simples: não permitir remover único ROOT
  if (role !== 'ROOT') {
    const roots = await prisma.user.count({ where: { role: 'ROOT' } })
    if (roots <= 1) {
      const target = await prisma.user.findUnique({ where: { id } })
      if (target?.role === 'ROOT') return res.status(400).json({ message: 'Não é permitido remover o único ROOT.' })
    }
  }

  const updated = await prisma.user.update({ where: { id }, data: { role } })
  return res.json({ id: updated.id, role: updated.role })
})

// PATCH /api/users/:id/password - ROOT redefine a senha de qualquer usuário
router.patch('/:id/password', verifyUser, isRoot, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { password } = req.body as { password?: string }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: 'Senha é obrigatória.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres.' })
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' })

    const password_hash = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { id }, data: { password_hash } })
    return res.json({ id, message: 'Senha atualizada com sucesso.' })
  } catch (_e) {
    return res.status(500).json({ message: 'Erro ao atualizar senha.' })
  }
})

// DELETE /api/users/:id - ROOT pode desativar/excluir conta (soft delete)
router.delete('/:id', verifyUser, isRoot, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const target = await prisma.user.findUnique({ where: { id } })
    if (!target) return res.status(404).json({ message: 'Usuário não encontrado.' })

    // impedir excluir o único ROOT
    if (target.role === 'ROOT') {
      const roots = await prisma.user.count({ where: { role: 'ROOT', is_active: true } })
      if (roots <= 1) return res.status(400).json({ message: 'Não é permitido excluir o único ROOT.' })
    }

    const deleted = await prisma.user.update({
      where: { id },
      data: { is_active: false, deleted_at: new Date() }
    })
    return res.json({ id: deleted.id, message: 'Usuário desativado.' })
  } catch (_e) {
    return res.status(500).json({ message: 'Erro ao excluir usuário.' })
  }
})