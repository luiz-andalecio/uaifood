const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  const cats = await prisma.category.findMany({ include: { items: true }, orderBy: { name: 'asc' } });
  for (const c of cats) {
    console.log(c.name, '-', c.items.length, 'itens');
    console.log('  exemplos:', c.items.slice(0,5).map(i => i.name).join(', '));
  }
  await prisma.$disconnect();
})();
