// router principal da API
import { Router } from 'express'
import { router as authRouter } from './auth.routes'
import { router as userRouter } from './profile.routes'
import { router as menuRouter } from './menu.routes'
import { router as ordersRouter } from './orders.routes'
import { router as adminRouter } from './metrics.routes'
import { router as adminOrdersRouter } from './admin.orders.routes'
import type { Request, Response } from 'express'

export const router = Router()

// versão da API
router.get('/', (_: Request, res: Response) => res.json({ name: 'UAIFood API', version: 'v1' }))

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/menu', menuRouter)
router.use('/orders', ordersRouter)
router.use('/admin', adminRouter)
router.use('/admin/orders', adminOrdersRouter)
