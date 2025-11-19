// rotas administrativas de pedidos: listar, atualizar status e cancelar
import { Router, type Request, type Response } from 'express'
import { PrismaClient, OrderStatus, type Prisma } from '@prisma/client'
import { verifyUser, isAdmin } from '../core/auth'
import { validateBody } from '../core/validate'
import { setStatusSchema } from '../validation/admin.schemas'
import { sendError, sendSuccess } from '../core/responses'

const prisma = new PrismaClient()
export const router = Router()

// GET /api/admin/orders - lista pedidos com usuario e itens
router.get('/', verifyUser, isAdmin, async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string }
  const where: Prisma.OrderWhereInput = {}
  if (status) where.status = status as OrderStatus

  const orders = await prisma.order.findMany({
    where,
    orderBy: { created_at: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { item: true } }
    }
  })
  res.json({ orders })
})

// PATCH /api/admin/orders/:id/status - atualiza status do pedido
router.patch('/:id/status', verifyUser, isAdmin, validateBody(setStatusSchema), async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body as { status: OrderStatus }
  try {
    const updated = await prisma.order.update({ where: { id }, data: { status } })
    return sendSuccess(res, { id: updated.id, status: updated.status })
  } catch (e) {
    return sendError(res, 'Pedido nao encontrado.', 404)
  }
})

// DELETE /api/admin/orders/:id - cancela um pedido
router.delete('/:id', verifyUser, isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { cancelled_at: new Date(), status: OrderStatus.CANCELADO }
    })
    return sendSuccess(res, { id: updated.id, cancelled_at: updated.cancelled_at })
  } catch (e) {
    return sendError(res, 'Pedido nao encontrado.', 404)
  }
})

export default router
