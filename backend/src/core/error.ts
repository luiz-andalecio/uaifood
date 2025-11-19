import { NextFunction, Request, Response } from 'express'

interface GenericError extends Error {
  status?: number
  code?: string
}

// handler global simples para erros não tratados
export function errorHandler(err: GenericError, _req: Request, res: Response, _next: NextFunction) {
  console.error('[UnhandledError]', err.message)
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack)
  }
  const status = typeof err.status === 'number' ? err.status : 500
  return res.status(status).json({ message: status === 500 ? 'Erro interno do servidor.' : err.message })
}