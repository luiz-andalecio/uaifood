// controller de menu
import type { Request, Response } from 'express'
import { sendSuccess, sendError } from '../core/responses'
import { listActiveMenu, createItem, updateItem, softDeleteItem } from './model'

export async function getMenu(_req: Request, res: Response) {
  const categories = await listActiveMenu()
  return sendSuccess(res, { categories })
}

export async function createMenuItem(req: Request, res: Response) {
  const { name, price, categoryId, description, image_url } = req.body as any
  if (!name || price == null) return sendError(res, 'Nome e preço são obrigatórios.', 400)
  const item = await createItem({ name, price, categoryId, description, image_url })
  return sendSuccess(res, item, 201)
}

export async function patchMenuItem(req: Request, res: Response) {
  const { id } = req.params
  const data = req.body as any
  const updated = await updateItem(id, data)
  return sendSuccess(res, updated)
}

export async function deleteMenuItem(req: Request, res: Response) {
  const { id } = req.params
  await softDeleteItem(id)
  return res.status(204).send()
}

