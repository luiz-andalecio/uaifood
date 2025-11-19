// middleware global de erros
import type { NextFunction, Request, Response } from 'express'
import logger from './logger'

interface AppError extends Error {
  status?: number
  code?: string
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction) {
  const status = typeof err.status === 'number' ? err.status : 500
  const code = err.code || 'INTERNAL_ERROR'
  const message = err.message || 'Erro interno do servidor.'

  logger.error({ status, code, message }, 'Unhandled error')

  if (res.headersSent) return
  res.status(status).json({ ok: false, code, message })
}

export default errorHandler
