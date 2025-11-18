// controller de usuarios: regras de negocio e orquestracao
import bcrypt from 'bcryptjs'
import { sendError, sendSuccess } from '../core/responses'
import { findUserById, listUsers, countUsers, updateUser, updateUserRole, softDeleteUser } from './model'
import type { Request, Response } from 'express'

export async function getMe(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const user = await findUserById(userId)
  if (!user) return sendError(res, 'Usuário não encontrado.', 404)
  const u: any = user
  return sendSuccess(res, { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, address: u.address ?? null, zip_code: u.zip_code ?? null })
}

export async function updateMe(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const { name, email, phone, address, zip_code, password } = req.body as any
  if (!name && !email && !phone && !address && !zip_code) return sendError(res, 'Nada para atualizar.', 400)

  // confirma senha antes de alterar
  if (!password) return sendError(res, 'Confirme sua senha para salvar as alterações.', 400)

  // verifica senha
  const current = await findUserById(userId)
  if (!current) return sendError(res, 'Usuário não encontrado.', 404)
  const ok = await bcrypt.compare(password, current.password_hash)
  if (!ok) return sendError(res, 'Senha atual inválida.', 401)

  try {
    const updated = await updateUser(userId, { name, email, phone, address, zip_code })
    const u: any = updated
    return sendSuccess(res, { id: updated.id, name: updated.name, email: updated.email, phone: updated.phone, address: u.address ?? null, zip_code: u.zip_code ?? null })
  } catch (e: any) {
    if (e.code === 'P2002') return sendError(res, 'Este e-mail já está em uso.', 400)
    return sendError(res, 'Erro ao atualizar usuário.', 500)
  }
}

export async function changeMyPassword(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string }
  const user = await findUserById(userId)
  if (!user) return sendError(res, 'Usuário não encontrado.', 404)
  const ok = await bcrypt.compare(currentPassword, user.password_hash)
  if (!ok) return sendError(res, 'Senha atual inválida.', 401)
  const password_hash = await bcrypt.hash(newPassword, 10)
  await updateUser(userId, {} as any) // placeholder para manter assinatura consistente
  // atualiza via prisma diretamente (evitando alterar model generico)
  // ideal seria ter um metodo especifico no model, mantido simples aqui:
  const { prisma } = await import('../core/prisma')
  await prisma.user.update({ where: { id: userId }, data: { password_hash } })
  return sendSuccess(res, { message: 'Senha alterada com sucesso.' })
}

export async function adminListUsers(req: Request, res: Response) {
  const page = Math.max(parseInt(String(req.query.page ?? '1')), 1)
  const pageSize = Math.max(Math.min(parseInt(String(req.query.pageSize ?? '20')), 100), 1)
  const [total, users] = await Promise.all([countUsers(true), listUsers(true, page, pageSize)])
  return sendSuccess(res, { total, page, pageSize, users })
}

export async function adminSetRole(req: Request, res: Response) {
  const { id } = req.params
  const { role } = req.body as { role?: 'CLIENTE' | 'ADMIN' | 'ROOT' }
  if (!role || !['CLIENTE', 'ADMIN', 'ROOT'].includes(role)) return sendError(res, 'Role inválida.', 400)
  const meId = (req as any).user.id as string
  if (id === meId) return sendError(res, 'Não é permitido alterar o próprio papel.', 400)
  const updated = await updateUserRole(id, role)
  return sendSuccess(res, { id: updated.id, name: updated.name, email: updated.email, role: updated.role })
}

export async function adminResetPassword(req: Request, res: Response) {
  const { id } = req.params
  const { password } = req.body as { password?: string }
  if (!password || password.length < 8) return sendError(res, 'Senha deve ter no mínimo 8 caracteres.', 400)
  const { prisma } = await import('../core/prisma')
  const password_hash = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { id }, data: { password_hash } })
  return sendSuccess(res, { message: 'Senha atualizada com sucesso.' })
}

export async function adminDeleteUser(req: Request, res: Response) {
  const { id } = req.params
  const meId = (req as any).user.id as string
  if (id === meId) return sendError(res, 'Não é permitido desativar a si mesmo.', 400)
  const user = await findUserById(id)
  if (!user) return sendError(res, 'Usuário não encontrado.', 404)
  await softDeleteUser(id)
  return res.status(204).send()
}
