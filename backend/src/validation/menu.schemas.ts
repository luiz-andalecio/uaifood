// Schemas Zod para Cardápio (itens)
import { z } from 'zod'

export const createItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  price: z.number().min(0, 'Preço inválido.'),
  categoryId: z.string().min(1, 'Categoria é obrigatória.'),
  description: z.string().optional(),
  image_url: z.string().url('URL de imagem inválida.').optional(),
})

export const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  is_active: z.boolean().optional(),
})

export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
