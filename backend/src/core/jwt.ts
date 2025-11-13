import jwt from 'jsonwebtoken'
import env from '../config/env'

export type JwtPayload = { sub: string; role: 'CLIENTE' | 'ADMIN' | 'ROOT' }

export function signJwt(payload: JwtPayload, opts?: jwt.SignOptions) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d', ...(opts ?? {}) })
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload
}
