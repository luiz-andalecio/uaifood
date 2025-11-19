"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemSchema = exports.createItemSchema = void 0;
// Schemas Zod para Cardápio (itens)
const zod_1 = require("zod");
exports.createItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nome é obrigatório.'),
    price: zod_1.z.number().min(0, 'Preço inválido.'),
    categoryId: zod_1.z.string().min(1, 'Categoria é obrigatória.'),
    description: zod_1.z.string().optional(),
    image_url: zod_1.z.string().url('URL de imagem inválida.').optional(),
});
exports.updateItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    price: zod_1.z.number().min(0).optional(),
    description: zod_1.z.string().optional(),
    image_url: zod_1.z.string().url().optional(),
    is_active: zod_1.z.boolean().optional(),
});
