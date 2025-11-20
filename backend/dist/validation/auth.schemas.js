"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
// Schemas Zod para autenticação
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nome é obrigatório.').max(50, 'Nome deve ter no máximo 50 caracteres.'),
    email: zod_1.z.string().email('Email inválido.').transform((v) => v.trim().toLowerCase()),
    password: zod_1.z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
    phone: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido.').transform((v) => v.trim().toLowerCase()),
    password: zod_1.z.string().min(1, 'Senha é obrigatória.'),
});
