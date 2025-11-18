"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
// Schemas Zod para Pedidos
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    tableNumber: zod_1.z.string().trim().min(1, 'Informe o numero da mesa.'),
    paymentMethod: zod_1.z.enum(['DINHEIRO', 'DEBITO', 'CREDITO', 'PIX']),
    items: zod_1.z
        .array(zod_1.z.object({
        itemId: zod_1.z.string().min(1),
        quantity: zod_1.z.number().int().min(1),
    }))
        .min(1, 'Informe ao menos um item.'),
});
