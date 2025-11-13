// middlewares de autenticação e autorização por role
import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../core/jwt'

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    // extrai token do header Authorization: Bearer <token>
    const auth = req.headers.authorization
    if (!auth) return res.status(401).json({ message: 'Token ausente.' })

    const [, token] = auth.split(' ')
    try {
        const payload = verifyJwt(token)
        ; (req as any).user = { id: payload.sub, role: payload.role }
        return next()
    } catch (e) {
        return res.status(401).json({ message: 'Token inválido.' })
    }
}

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