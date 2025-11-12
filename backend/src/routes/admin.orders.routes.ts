// rotas administrativas de pedidos: listar, atualizar status e cancelar
import { Router, type Request, type Response } from 'express'
import { PrismaClient, OrderStatus } from '@prisma/client'
import { verifyToken, isAdmin } from '../middlewares/auth'

const prisma = new PrismaClient()
export const router = Router()

// GET /api/admin/orders - lista pedidos com usuario e itens
router.get('/', verifyToken, isAdmin, async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string }
  const where: any = {}
  if (status) where.status = status // sera validado pelo banco quando enum existir

  const orders = await prisma.order.findMany({
    where,
    orderBy: { created_at: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { item: true } } as any
    }
  })
  res.json({ orders })
})

// PATCH /api/admin/orders/:id/status - atualiza status do pedido
router.patch('/:id/status', verifyToken, isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body as { status?: OrderStatus | string }
  const allowed = Object.values(OrderStatus)
  if (!status || !allowed.includes(status as OrderStatus)) {
    return res.status(400).json({ message: 'Status invalido.' })
  }
  try {
    const updated = await prisma.order.update({ where: { id }, data: { status: status as OrderStatus } })
    return res.json({ id: updated.id, status: (updated as any).status })
  } catch (e) {
    return res.status(404).json({ message: 'Pedido nao encontrado.' })
  }
})

// DELETE /api/admin/orders/:id - cancela um pedido
router.delete('/:id', verifyToken, isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { cancelled_at: new Date(), status: OrderStatus.CANCELADO }
    })
    return res.json({ id: updated.id, cancelled_at: updated.cancelled_at })
  } catch (e) {
    return res.status(404).json({ message: 'Pedido nao encontrado.' })
  }
})

export default router
