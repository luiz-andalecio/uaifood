"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminResetPasswordSchema = exports.roleUpdateSchema = exports.changePasswordSchema = exports.profileUpdateSchema = void 0;
// Schemas Zod para Usuários (perfil e administração)
const zod_1 = require("zod");
exports.profileUpdateSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1, 'Nome é obrigatório.').optional(),
    email: zod_1.z.string().email('Email inválido.').transform((v) => v.trim().toLowerCase()).optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    zip_code: zod_1.z.string().optional(),
    password: zod_1.z.string().min(6, 'Senha inválida.').optional(),
})
    .refine((data) => !(data.email && !data.password), {
    message: 'Senha atual é obrigatória para alterar o email.',
    path: ['password'],
});
exports.changePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, 'Senha atual é obrigatória.'),
    newPassword: zod_1.z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres.'),
    confirmPassword: zod_1.z.string().min(8, 'Confirmação de senha é obrigatória.'),
})
    .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
});
exports.roleUpdateSchema = zod_1.z.object({
    role: zod_1.z.enum(['CLIENTE', 'ADMIN', 'ROOT'])
});
exports.adminResetPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
});
