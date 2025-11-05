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

  // cria usuario ROOT adicional (contato@uaifood.com.br) se nao existir
  const root2Email = 'contato@uaifood.com.br'
  const root2Exists = await prisma.user.findUnique({ where: { email: root2Email } })
  if (!root2Exists) {
    await prisma.user.create({
      data: {
        name: 'Root',
        email: root2Email,
        password_hash: await bcrypt.hash('UAIFoodRoot123!!!', 10),
        role: UserRole.ROOT
      }
    })
    console.log('Usuario ROOT criado: contato@uaifood.com.br / UAIFoodRoot123!!!')
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

  // itens em cada categoria
  const cat = await prisma.category.findMany()
  const byName: Record<string, string> = {}
  cat.forEach((c) => (byName[c.name] = c.id))

  const itemsByCategory: Record<string, Array<{ id: string; name: string; price: number }>> = {
    'Entradas': [
      { id: 'seed-entradas-1', name: 'Pão de Queijo', price: 6.0 },
      { id: 'seed-entradas-2', name: 'Torresmo Crocante', price: 10.0 },
      { id: 'seed-entradas-3', name: 'Bolinho de Mandioca', price: 9.0 },
      { id: 'seed-entradas-4', name: 'Caldo de Feijão', price: 8.5 },
      { id: 'seed-entradas-5', name: 'Antepasto Mineiro', price: 12.0 }
    ],
    'Pratos Principais': [
      { id: 'seed-pratos-1', name: 'Feijão Tropeiro', price: 22.0 },
      { id: 'seed-pratos-2', name: 'Frango com Quiabo', price: 24.0 },
      { id: 'seed-pratos-3', name: 'Vaca Atolada', price: 28.0 },
      { id: 'seed-pratos-4', name: 'Lombo Suíno ao Molho', price: 26.0 },
      { id: 'seed-pratos-5', name: 'Tutu à Mineira', price: 20.0 },
      { id: 'seed-pratos-6', name: 'Bife Acebolado', price: 23.0 },
      { id: 'seed-pratos-7', name: 'Costelinha com Canjiquinha', price: 29.0 }
    ],
    'Acompanhamentos': [
      { id: 'seed-acomp-1', name: 'Arroz Branco', price: 8.0 },
      { id: 'seed-acomp-2', name: 'Farofa de Manteiga', price: 7.0 },
      { id: 'seed-acomp-3', name: 'Mandioca Frita', price: 9.0 },
      { id: 'seed-acomp-4', name: 'Salada de Folhas', price: 6.5 },
      { id: 'seed-acomp-5', name: 'Legumes Salteados', price: 8.5 }
    ],
    'Bebidas': [
      { id: 'seed-bebidas-1', name: 'Suco de Laranja', price: 7.0 },
      { id: 'seed-bebidas-2', name: 'Refrigerante Lata', price: 6.0 },
      { id: 'seed-bebidas-3', name: 'Água Mineral', price: 4.0 },
      { id: 'seed-bebidas-4', name: 'Cerveja Long Neck', price: 10.0 },
      { id: 'seed-bebidas-5', name: 'Suco de Uva', price: 7.5 }
    ],
    'Sobremesas': [
      { id: 'seed-sobrem-1', name: 'Doce de Leite', price: 7.0 },
      { id: 'seed-sobrem-2', name: 'Romeu e Julieta', price: 8.0 },
      { id: 'seed-sobrem-3', name: 'Pudim de Leite', price: 9.0 },
      { id: 'seed-sobrem-4', name: 'Ambrosia', price: 8.5 },
      { id: 'seed-sobrem-5', name: 'Cocada Cremosa', price: 7.5 }
    ]
  }

  for (const [catName, arr] of Object.entries(itemsByCategory)) {
    const categoryId = byName[catName]
    if (!categoryId) continue
    for (const it of arr) {
      await prisma.item.upsert({
        where: { id: it.id },
        update: {
          name: it.name,
          price: it.price,
          category_id: categoryId,
          is_active: true,
          deleted_at: null
        },
        create: {
          id: it.id,
          name: it.name,
          price: it.price,
          category_id: categoryId,
          is_active: true
        }
      })
    }
  }
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
