// model de pedidos: consultas e escrita via Prisma
import { prisma } from '../core/prisma'
import { PaymentMethod, OrderStatus } from '@prisma/client'

export function findOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    include: { items: { include: { item: true } } },
  })
}

export function findActiveItemsByIds(ids: string[]) {
  return prisma.item.findMany({ where: { id: { in: ids }, is_active: true } })
}

export async function createOrderWithItems(params: {
  userId: string
  tableNumber: string | null
  paymentMethod: PaymentMethod | null
  subtotal: number
  tax: number
  total: number
  items: Array<{ item_id: string; quantity: number; unit_price: number; total_price: number }>
}) {
  const { userId, tableNumber, paymentMethod, subtotal, tax, total, items } = params
  const created = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        user_id: userId,
        table_number: tableNumber,
        payment_method: paymentMethod,
        subtotal,
        tax,
        total,
        status: OrderStatus.PENDENTE,
      },
    })
    await tx.orderItem.createMany({ data: items.map((oi) => ({ ...oi, order_id: order.id })) })
    return order
  })
  return created
}
