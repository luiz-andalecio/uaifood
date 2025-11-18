import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyUser, isAdmin } from '../middlewares/auth'

const prisma = new PrismaClient()
export const router = Router()

// GET /api/admin/dashboard - métricas simples
router.get('/dashboard', verifyUser, isAdmin, async (_req: Request, res: Response) => {
  const [users, items, orders] = await Promise.all([
    prisma.user.count({ where: { is_active: true } }),
    prisma.item.count({ where: { is_active: true } }),
    prisma.order.count()
  ])

  return res.json({ users, items, orders })
})
