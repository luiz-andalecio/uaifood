// autenticação básica por JWT e verificação de perfil (role)
import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from './jwt'
import { prisma } from './prisma'
import type { UserRole } from '@prisma/client'

// lê somente o header 'x-access-token'
function getTokenFromRequest(req: Request): string | null {
    const headerToken = (req.headers['x-access-token'] as string | undefined)?.trim()
    return headerToken || null
}

// verifyUser: valida o JWT e coloca dados mínimos do usuário na requisição
export function verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = getTokenFromRequest(req)
    if (!token) return res.status(401).json({ message: 'Operação não permitida' })
    try {
        const payload = verifyJwt(token)
        req.user = { id: payload.sub, role: payload.role as UserRole }
        req.userId = payload.sub
        next()
    } catch (_err) {
        return res.status(401).json({ message: 'Operação não permitida' })
    }
}

// (remoção de alias verifyToken: usar apenas verifyUser nas rotas)

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    const user = req.user
    if (!user) return res.status(401).json({ message: 'Não autenticado.' })
    if (user.role === 'ADMIN' || user.role === 'ROOT') return next()
    return res.status(403).json({ message: 'Acesso restrito a administradores.' })
}

export function isRoot(req: Request, res: Response, next: NextFunction) {
    const user = req.user
    if (!user) return res.status(401).json({ message: 'Não autenticado.' })
    if (user.role === 'ROOT') return next()
    return res.status(403).json({ message: 'Acesso restrito ao ROOT.' })
}

// verifyUserProfile: usado em fluxos pontuais para confirmar se o token atende a um perfil específico
export async function verifyUserProfile(token: string, requiredRole: UserRole) {
    try {
        const payload = verifyJwt(token)
        const user = await prisma.user.findUnique({ where: { id: String(payload.sub) } })
        if (!user) return Promise.reject({ status: 401, message: 'Usuário não encontrado.' })
        if (user.role === requiredRole || user.role === 'ROOT') return { userId: user.id }
        return Promise.reject({ status: 403, message: 'Usuário não tem permissão para acessar o recurso.' })
    } catch (err) {
        return Promise.reject({ status: 401, message: (err as Error).message || 'Token inválido!' })
    }
}