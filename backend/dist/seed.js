"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// script de seed para popular banco com dados iniciais
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
async function main() {
    // cria usuario ROOT padrao
    const rootEmail = 'root@uaifood.com';
    const rootExists = await prisma.user.findUnique({ where: { email: rootEmail } });
    if (!rootExists) {
        await prisma.user.create({
            data: {
                name: 'Root',
                email: rootEmail,
                password_hash: await bcryptjs_1.default.hash('root123', 10),
                role: client_1.UserRole.ROOT
            }
        });
        console.log('Usuario ROOT criado: root@uaifood.com / root123');
    }
    // categorias
    const categorias = [
        { name: 'Entradas' },
        { name: 'Pratos Principais' },
        { name: 'Acompanhamentos' },
        { name: 'Bebidas' },
        { name: 'Sobremesas' }
    ];
    for (const c of categorias) {
        await prisma.category.upsert({ where: { name: c.name }, update: {}, create: c });
    }
    // itens em cada categoria
    const cat = await prisma.category.findMany();
    const byName = {};
    cat.forEach((c) => (byName[c.name] = c.id));
    const itemsByCategory = {
        'Entradas': [
            { id: 'seed-entradas-1', name: 'Pão de Queijo', price: 6.0 },
            { id: 'seed-entradas-2', name: 'Torresmo Crocante', price: 10.0 },
            { id: 'seed-entradas-3', name: 'Bolinho de Mandioca', price: 9.0 },
            { id: 'seed-entradas-4', name: 'Caldo de Feijão', price: 8.5 },
            { id: 'seed-entradas-5', name: 'Antepasto Mineiro', price: 12.0 },
            { id: 'seed-entradas-6', name: 'Queijo Minas Frito', price: 11.0 },
            { id: 'seed-entradas-7', name: 'Pastel de Angu', price: 7.5 },
            { id: 'seed-entradas-8', name: 'Linguiça Acebolada', price: 13.0 },
            { id: 'seed-entradas-9', name: 'Bolinho de Arroz', price: 6.5 },
            { id: 'seed-entradas-10', name: 'Caldinho de Feijão com Torresmo', price: 9.5 }
        ],
        'Pratos Principais': [
            { id: 'seed-pratos-1', name: 'Feijão Tropeiro', price: 22.0 },
            { id: 'seed-pratos-2', name: 'Frango com Quiabo', price: 24.0 },
            { id: 'seed-pratos-3', name: 'Vaca Atolada', price: 28.0 },
            { id: 'seed-pratos-4', name: 'Lombo Suíno ao Molho', price: 26.0 },
            { id: 'seed-pratos-5', name: 'Tutu à Mineira', price: 20.0 },
            { id: 'seed-pratos-6', name: 'Bife Acebolado', price: 23.0 },
            { id: 'seed-pratos-7', name: 'Costelinha com Canjiquinha', price: 29.0 },
            { id: 'seed-pratos-8', name: 'Galinhada Mineira', price: 25.0 },
            { id: 'seed-pratos-9', name: 'Frango Caipira', price: 24.0 },
            { id: 'seed-pratos-10', name: 'Carne de Panela', price: 21.0 }
        ],
        'Acompanhamentos': [
            { id: 'seed-acomp-1', name: 'Arroz Branco', price: 8.0 },
            { id: 'seed-acomp-2', name: 'Farofa de Manteiga', price: 7.0 },
            { id: 'seed-acomp-3', name: 'Mandioca Frita', price: 9.0 },
            { id: 'seed-acomp-4', name: 'Salada de Folhas', price: 6.5 },
            { id: 'seed-acomp-5', name: 'Legumes Salteados', price: 8.5 },
            { id: 'seed-acomp-6', name: 'Couve Mineira', price: 6.5 },
            { id: 'seed-acomp-7', name: 'Polenta Frita', price: 7.5 },
            { id: 'seed-acomp-8', name: 'Angu (Polenta de Fubá)', price: 10.0 },
            { id: 'seed-acomp-9', name: 'Purê de Batata com Queijo Minas', price: 9.0 },
            { id: 'seed-acomp-10', name: 'Farofa de Torresmo', price: 8.0 }
        ],
        'Bebidas': [
            { id: 'seed-bebidas-1', name: 'Suco de Laranja', price: 7.0 },
            { id: 'seed-bebidas-2', name: 'Refrigerante Lata', price: 6.0 },
            { id: 'seed-bebidas-3', name: 'Água Mineral', price: 4.0 },
            { id: 'seed-bebidas-4', name: 'Cerveja Long Neck', price: 10.0 },
            { id: 'seed-bebidas-5', name: 'Suco de Uva', price: 7.5 },
            { id: 'seed-bebidas-6', name: 'Caldo de Cana', price: 8.0 },
            { id: 'seed-bebidas-7', name: 'Cachaça Artesanal', price: 15.0 },
            { id: 'seed-bebidas-8', name: 'Chá de Erva-Doce', price: 5.0 },
            { id: 'seed-bebidas-9', name: 'Café Coado', price: 5.0 },
            { id: 'seed-bebidas-10', name: 'Guaraná Natural', price: 6.5 }
        ],
        'Sobremesas': [
            { id: 'seed-sobrem-1', name: 'Doce de Leite', price: 7.0 },
            { id: 'seed-sobrem-2', name: 'Romeu e Julieta', price: 8.0 },
            { id: 'seed-sobrem-3', name: 'Pudim de Leite', price: 9.0 },
            { id: 'seed-sobrem-4', name: 'Ambrosia', price: 8.5 },
            { id: 'seed-sobrem-5', name: 'Cocada Cremosa', price: 7.5 },
            { id: 'seed-sobrem-6', name: 'Queijadinha', price: 6.5 },
            { id: 'seed-sobrem-7', name: 'Doce de Abóbora com Coco', price: 7.0 },
            { id: 'seed-sobrem-8', name: 'Bolo de Fubá', price: 6.5 },
            { id: 'seed-sobrem-9', name: 'Pé-de-Moleque', price: 5.5 },
            { id: 'seed-sobrem-10', name: 'Doce de Banana', price: 6.0 }
        ]
    };
    for (const [catName, arr] of Object.entries(itemsByCategory)) {
        const categoryId = byName[catName];
        if (!categoryId)
            continue;
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
            });
        }
    }
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
