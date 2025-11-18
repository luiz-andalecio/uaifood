"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStatusSchema = void 0;
// Schemas Zod para Admin
const zod_1 = require("zod");
exports.setStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDENTE', 'PREPARANDO', 'PRONTO', 'ENTREGUE', 'CANCELADO'], {
        required_error: 'Status é obrigatório.',
        invalid_type_error: 'Status invalido.'
    })
});
