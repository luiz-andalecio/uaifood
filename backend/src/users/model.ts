// model de usuarios: funcoes de acesso a dados via Prisma
import { prisma } from '../core/prisma'

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export function listUsers(activeOnly = true, page = 1, pageSize = 20) {
  const skip = Math.max(0, (page - 1) * pageSize)
  return prisma.user.findMany({
    where: activeOnly ? { is_active: true } : {},
    orderBy: { created_at: 'desc' },
    skip,
    take: pageSize,
    select: { id: true, name: true, email: true, role: true }
  })
}

export function countUsers(activeOnly = true) {
  return prisma.user.count({ where: activeOnly ? { is_active: true } : {} })
}

export function updateUser(id: string, data: Partial<{ name: string; email: string; phone: string; address: string; zip_code: string }>) {
  return prisma.user.update({ where: { id }, data })
}

export function updateUserRole(id: string, role: 'CLIENTE' | 'ADMIN' | 'ROOT') {
  return prisma.user.update({ where: { id }, data: { role } })
}

export function softDeleteUser(id: string) {
  return prisma.user.update({ where: { id }, data: { is_active: false, deleted_at: new Date() } })
}
