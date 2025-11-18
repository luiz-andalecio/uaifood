"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// rotas de perfil do usuario: obter, atualizar e trocar senha
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../core/validate");
const users_schemas_1 = require("../validation/users.schemas");
const controller_1 = require("../users/controller");
const prisma = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// GET /api/users/me - dados do usuario logado
exports.router.get('/me', auth_1.verifyToken, controller_1.getMe);
// PATCH /api/users/me - atualizar dados basicos (nome, email, telefone, endereco). Exige senha se email mudar.
exports.router.patch('/me', auth_1.verifyToken, (0, validate_1.validateBody)(users_schemas_1.profileUpdateSchema), controller_1.updateMe);
// POST /api/users/me/change-password - trocar senha via modal
exports.router.post('/me/change-password', auth_1.verifyToken, (0, validate_1.validateBody)(users_schemas_1.changePasswordSchema), controller_1.changeMyPassword);
exports.default = exports.router;
// ----- Rotas administrativas de usuários -----
// Observação: mantidas no mesmo arquivo para simplicidade e porque já montamos em /api/users no router principal.
// GET /api/users - lista usuários (admin/root), com paginação simples
exports.router.get('/', auth_1.verifyToken, auth_1.isAdmin, controller_1.adminListUsers);
// PATCH /api/users/:id/role - altera papel (apenas ROOT)
exports.router.patch('/:id/role', auth_1.verifyToken, auth_1.isRoot, controller_1.adminSetRole);
// POST /api/users/:id/password - redefine senha de um usuário (ADMIN/ROOT)
exports.router.post('/:id/password', auth_1.verifyToken, auth_1.isAdmin, controller_1.adminResetPassword);
// DELETE /api/users/:id - desativa usuário (admin/root)
exports.router.delete('/:id', auth_1.verifyToken, auth_1.isAdmin, controller_1.adminDeleteUser);
