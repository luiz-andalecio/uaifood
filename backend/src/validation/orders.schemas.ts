// Schemas Zod para Pedidos
import { z } from 'zod'

export const createOrderSchema = z.object({
  tableNumber: z.string().trim().min(1, 'Informe o numero da mesa.'),
  paymentMethod: z.enum(['DINHEIRO', 'DEBITO', 'CREDITO', 'PIX']),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, 'Informe ao menos um item.'),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
