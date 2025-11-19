// Schemas Zod para Admin
import { z } from 'zod'

export const setStatusSchema = z.object({
  status: z.enum(['PENDENTE', 'PREPARANDO', 'PRONTO', 'ENTREGUE', 'CANCELADO'], {
    required_error: 'Status é obrigatório.',
    invalid_type_error: 'Status invalido.'
  })
})

export type SetStatusInput = z.infer<typeof setStatusSchema>
