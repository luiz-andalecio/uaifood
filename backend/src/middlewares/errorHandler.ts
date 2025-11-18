// middleware global de erros
import type { NextFunction, Request, Response } from 'express'
import logger from '../core/logger'

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = typeof err?.status === 'number' ? err.status : 500
  const code = err?.code || 'INTERNAL_ERROR'
  const message = err?.message || 'Erro interno do servidor.'

  // log estruturado
  logger.error({ err, status, code }, message)

  if (res.headersSent) return
  res.status(status).json({ ok: false, code, message })
}

export default errorHandler
