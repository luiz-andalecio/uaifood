// script de seed para popular banco com dados iniciais
// comentarios em portugues, sem acentos para evitar problemas de encoding
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function main() {
  // cria usuario ROOT padrao (nao usar em producao)
  const rootEmail = 'root@uaifood.com'
  const rootExists = await prisma.user.findUnique({ where: { email: rootEmail } })
  if (!rootExists) {
    await prisma.user.create({
      data: {
        name: 'Root',
        email: rootEmail,
        password_hash: await bcrypt.hash('root123', 10),
        role: UserRole.ROOT
      }
    })
    console.log('Usuario ROOT criado: root@uaifood.com / root123')
  }

  // categorias
  const categorias = [
    { name: 'Entradas' },
    { name: 'Pratos Principais' },
    { name: 'Acompanhamentos' },
    { name: 'Bebidas' },
    { name: 'Sobremesas' }
  ]
  for (const c of categorias) {
    await prisma.category.upsert({ where: { name: c.name }, update: {}, create: c })
  }

  // alguns itens
  const cat = await prisma.category.findMany()
  const byName: Record<string, string> = {}
  cat.forEach((c) => (byName[c.name] = c.id))

  await prisma.item.upsert({
    where: { id: 'seed-feijao' },
    update: {},
    create: {
      id: 'seed-feijao',
      name: 'Feijao Tropeiro',
      price: 12.0,
      category_id: byName['Pratos Principais']
    }
  })
  await prisma.item.upsert({
    where: { id: 'seed-arroz' },
    update: {},
    create: {
      id: 'seed-arroz',
      name: 'Arroz Branco',
      price: 8.0,
      category_id: byName['Acompanhamentos']
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
