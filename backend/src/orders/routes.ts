// rotas de pedidos: criar e listar pedidos do usuario autenticado
import { Router, type Request, type Response } from 'express'
import { PrismaClient, PaymentMethod, OrderStatus } from '@prisma/client'
import { verifyUser } from '../middlewares/auth'
import { validateBody } from '../core/validate'
import { sendError, sendSuccess } from '../core/responses'
import { listMyOrders, createOrder as createOrderController } from './controller'
import { createOrderSchema } from '../validation/orders.schemas'

const prisma = new PrismaClient()
export const router = Router()

// GET /api/orders - lista pedidos do usuario atual
router.get('/', verifyUser, listMyOrders)

router.post('/', verifyUser, validateBody(createOrderSchema), createOrderController)
