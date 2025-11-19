// controller de menu
import type { Request, Response } from 'express'

interface CreateItemBody {
  name: string
  price: number
  categoryId: string
  description?: string
  image_url?: string
}

interface UpdateItemBody {
  name?: string
  price?: number
  description?: string
  image_url?: string
  is_active?: boolean
  categoryId?: string
}
import { sendSuccess, sendError } from '../core/responses'
import { listActiveMenu, createItem, updateItem, softDeleteItem } from './model'

export async function getMenu(_req: Request, res: Response) {
  return sendSuccess(res, { categories: await listActiveMenu() })
}

export async function createMenuItem(req: Request, res: Response) {
  const { name, price, categoryId, description, image_url } = req.body as CreateItemBody
  if (!name || price == null) return sendError(res, 'Nome e preço são obrigatórios.', 400)
  const item = await createItem({ name, price, categoryId, description, image_url })
  return sendSuccess(res, item, 201)
}

export async function patchMenuItem(req: Request, res: Response) {
  const updated = await updateItem(req.params.id, req.body as UpdateItemBody)
  return sendSuccess(res, updated)
}

export async function deleteMenuItem(req: Request, res: Response) {
  const { id } = req.params
  await softDeleteItem(id)
  return res.status(204).send()
}

