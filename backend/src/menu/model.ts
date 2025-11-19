// model de menu: categorias e itens
import { prisma } from '../core/prisma'

export function listActiveMenu() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { items: { where: { is_active: true }, orderBy: { name: 'asc' } } },
  })
}

export function createItem(data: { name: string; price: number; categoryId: string; description?: string; image_url?: string }) {
  const { name, price, categoryId, description, image_url } = data
  return prisma.item.create({ data: { name, price, category_id: categoryId, description, image_url } })
}

export function updateItem(id: string, data: Partial<{ name: string; price: number; description: string; image_url: string; is_active: boolean }>) {
  return prisma.item.update({ where: { id }, data })
}

export function softDeleteItem(id: string) {
  return prisma.item.update({ where: { id }, data: { is_active: false, deleted_at: new Date() } })
}

