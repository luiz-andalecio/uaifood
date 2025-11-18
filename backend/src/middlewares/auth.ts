// middlewares de autenticação e autorização por role (estilo semelhante ao jwt-example)
import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../core/jwt'
import { prisma } from '../core/prisma'

// extrai token de 'x-access-token' (jwt-example) ou 'Authorization: Bearer <token>'
function getTokenFromRequest(req: Request): string | null {
    const headerToken = (req.headers['x-access-token'] as string | undefined)?.trim()
    if (headerToken) return headerToken
    const auth = req.headers.authorization
    if (!auth) return null
    const [scheme, token] = auth.split(' ')
    if (scheme?.toLowerCase() !== 'bearer' || !token) return null
    return token
}

// verifyUser: valida token e popula req.user/req.userId (similar ao jwt-example)
export function verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = getTokenFromRequest(req)
    if (!token) return res.status(401).json({ message: 'Operação não permitida' })

    try {
        const payload = verifyJwt(token)
        ;(req as any).user = { id: payload.sub, role: payload.role }
        ;(req as any).userId = payload.sub
        return next()
    } catch (e) {
        return res.status(401).json({ message: 'Operação não permitida' })
    }
}

// alias para compatibilidade com código existente
export const verifyToken = verifyUser

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user
    if (!user) return res.status(401).json({ message: 'Não autenticado.' })
    if (user.role === 'ADMIN' || user.role === 'ROOT') return next()
    return res.status(403).json({ message: 'Acesso restrito a administradores.' })
}

export function isRoot(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user
    if (!user) return res.status(401).json({ message: 'Não autenticado.' })
    if (user.role === 'ROOT') return next()
    return res.status(403).json({ message: 'Acesso restrito ao ROOT.' })
}

// verifyUserProfile: valida token (string) e garante o perfil/role requerido
// Retorna { userId } em caso de sucesso; rejeita com { status, message } em caso de erro (similar ao jwt-example)
export async function verifyUserProfile(token: string, requiredRole: 'CLIENTE' | 'ADMIN' | 'ROOT') {
    try {
        const payload = verifyJwt(token) // lança erro se inválido
        const user = await prisma.user.findUnique({ where: { id: String(payload.sub) } })
        if (!user) {
            return Promise.reject({ status: 401, message: 'Usuário não encontrado.' })
        }
        if (user.role === requiredRole || user.role === 'ROOT') {
            return Promise.resolve({ userId: user.id })
        }
        return Promise.reject({ status: 403, message: 'Usuário não tem permissão para acessar o recurso.' })
    } catch (err: any) {
        return Promise.reject({ status: 401, message: err?.message || 'Token inválido!' })
    }
}