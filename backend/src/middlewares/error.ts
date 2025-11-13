import { NextFunction, Request, Response } from 'express'

// handler global simples para erros não tratados
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[UnhandledError]', err?.message || err)
  if (process.env.NODE_ENV !== 'production' && err?.stack) {
    console.error(err.stack)
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' })
}