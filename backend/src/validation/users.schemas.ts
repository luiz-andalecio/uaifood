// Schemas Zod para Usuários (perfil e administração)
import { z } from 'zod'

export const profileUpdateSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório.').optional(),
    email: z.string().email('Email inválido.').transform((v: string) => v.trim().toLowerCase()).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    zip_code: z.string().optional(),
    password: z.string().min(6, 'Senha inválida.').optional(),
  })
  .refine((data) => !(data.email && !data.password), {
    message: 'Senha atual é obrigatória para alterar o email.',
    path: ['password'],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória.'),
    newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres.'),
    confirmPassword: z.string().min(8, 'Confirmação de senha é obrigatória.'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  })

export const roleUpdateSchema = z.object({
  role: z.enum(['CLIENTE', 'ADMIN', 'ROOT'])
})

export const adminResetPasswordSchema = z.object({
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>
export type AdminResetPasswordInput = z.infer<typeof adminResetPasswordSchema>
