// Schemas Zod para autenticação
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.').max(50, 'Nome deve ter no máximo 50 caracteres.'),
  email: z.string().email('Email inválido.').transform((v: string) => v.trim().toLowerCase()),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
  phone: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido.').transform((v: string) => v.trim().toLowerCase()),
  password: z.string().min(1, 'Senha é obrigatória.'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
