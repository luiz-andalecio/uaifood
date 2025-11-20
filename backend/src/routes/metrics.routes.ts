import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyUser, isAdmin } from '../core/auth'
import { sendSuccess } from '../core/responses'

const prisma = new PrismaClient()
export const router = Router()

// GET /api/admin/dashboard - métricas simples
router.get('/dashboard', verifyUser, isAdmin, async (_req: Request, res: Response) => {
  const [users, items, orders] = await Promise.all([
    prisma.user.count({ where: { is_active: true } }),
    prisma.item.count({ where: { is_active: true } }),
    prisma.order.count()
  ])

  // usa helper padronizado para alinhar com consumo no frontend (json.data.*)
  return sendSuccess(res, { users, items, orders })
})
