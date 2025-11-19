// middleware de validação usando Zod
import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema, ZodIssue } from 'zod'
import { sendValidationError } from './responses'

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors = result.error.issues.map((i: ZodIssue) => ({ field: i.path.join('.'), message: i.message }))
      return sendValidationError(res, errors)
    }
    // substitui body normalizado
    req.body = result.data
    next()
  }
}
