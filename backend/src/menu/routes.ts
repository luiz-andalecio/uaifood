// rotas de cardápio (públicas e administrativas)
import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyUser, isAdmin } from '../middlewares/auth'
import { validateBody } from '../core/validate'
import { createItemSchema, updateItemSchema } from '../validation/menu.schemas'
import { getMenu, createMenuItem, patchMenuItem, deleteMenuItem } from './controller'

const prisma = new PrismaClient()
export const router = Router()

// GET /api/menu - lista categorias e itens ativos
router.get('/', getMenu)

router.post('/items', verifyUser, isAdmin, validateBody(createItemSchema), createMenuItem)

router.patch('/items/:id', verifyUser, isAdmin, validateBody(updateItemSchema), patchMenuItem)

router.delete('/items/:id', verifyUser, isAdmin, deleteMenuItem)