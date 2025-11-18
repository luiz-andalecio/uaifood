// helpers de resposta padronizada
import type { Response } from 'express'

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ ok: true, data })
}

export function sendMessage(res: Response, message: string, status = 200) {
  return res.status(status).json({ ok: true, message })
}

export function sendError(res: Response, message: string, status = 400, details?: unknown) {
  const body: any = { ok: false, message }
  if (details) body.details = details
  return res.status(status).json(body)
}

export function sendValidationError(
  res: Response,
  errors: Array<{ field?: string; message: string }>,
  message = 'Dados inválidos.'
) {
  return res.status(422).json({ ok: false, message, errors })
}
