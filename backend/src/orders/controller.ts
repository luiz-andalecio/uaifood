// controller de pedidos
import type { Request, Response } from 'express'
import { PaymentMethod } from '@prisma/client'
import { sendError, sendSuccess } from '../core/responses'
import { findActiveItemsByIds, findOrdersByUser, createOrderWithItems } from './model'

export async function listMyOrders(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const orders = await findOrdersByUser(userId)
  return sendSuccess(res, { orders })
}

export async function createOrder(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const { tableNumber, paymentMethod, items } = req.body as {
    tableNumber: string
    paymentMethod: keyof typeof PaymentMethod
    items: Array<{ itemId: string; quantity: number }>
  }

  const ids = items.map((i) => i.itemId)
  const dbItems = await findActiveItemsByIds(ids)
  if (dbItems.length !== ids.length) return sendError(res, 'Alguns itens sao invalidos ou inativos.', 400)

  let subtotal = 0
  const orderItemsData = items.map((i) => {
    const found = dbItems.find((d) => d.id === i.itemId)!
    const unit = Number(found.price)
    const qty = Math.max(1, Number(i.quantity || 1))
    const total = unit * qty
    subtotal += total
    return { item_id: i.itemId, quantity: qty, unit_price: unit, total_price: total }
  })
  const tax = Number((subtotal * 0.0).toFixed(2))
  const total = subtotal + tax

  const created = await createOrderWithItems({
    userId,
    tableNumber: tableNumber || null,
    paymentMethod: paymentMethod as PaymentMethod,
    subtotal,
    tax,
    total,
    items: orderItemsData,
  })

  return sendSuccess(res, { id: created.id, total: created.total }, 201)
}
