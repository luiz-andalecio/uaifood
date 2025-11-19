// instancia compartilhada do Prisma para evitar multiplas conexoes
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
