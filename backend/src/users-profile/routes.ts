// rotas de perfil do usuario: obter, atualizar e trocar senha
import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { verifyUser, isAdmin, isRoot } from '../core/auth'
import { validateBody } from '../core/validate'
import { profileUpdateSchema, changePasswordSchema } from '../validation/users.schemas'
import {
  getMe,
  updateMe,
  changeMyPassword,
  adminListUsers,
  adminSetRole,
  adminResetPassword,
  adminDeleteUser,
} from '../users/controller'

const prisma = new PrismaClient()
export const router = Router()


// GET /api/users/me - dados do usuario logado
router.get('/me', verifyUser, getMe)

// PATCH /api/users/me - atualizar dados basicos (nome, email, telefone, endereco). Exige senha se email mudar.
router.patch('/me', verifyUser, validateBody(profileUpdateSchema), updateMe)

// POST /api/users/me/change-password - trocar senha via modal
router.post('/me/change-password', verifyUser, validateBody(changePasswordSchema), changeMyPassword)

export default router

// ----- Rotas administrativas de usuários -----
// Observação: mantidas no mesmo arquivo para simplicidade e porque já montamos em /api/users no router principal.

// GET /api/users - lista usuários (admin/root), com paginação simples
router.get('/', verifyUser, isAdmin, adminListUsers)

// PATCH /api/users/:id/role - altera papel (apenas ROOT)
router.patch('/:id/role', verifyUser, isRoot, adminSetRole)

// POST /api/users/:id/password - redefine senha de um usuário (ADMIN/ROOT)
router.post('/:id/password', verifyUser, isAdmin, adminResetPassword)

// DELETE /api/users/:id - desativa usuário (admin/root)
router.delete('/:id', verifyUser, isAdmin, adminDeleteUser)
