"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// rotas de autenticação: login e registro
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../core/jwt");
const validate_1 = require("../core/validate");
const auth_schemas_1 = require("../validation/auth.schemas");
const responses_1 = require("../core/responses");
const prisma = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// POST /api/auth/register
exports.router.post('/register', (0, validate_1.validateBody)(auth_schemas_1.registerSchema), async (req, res) => {
    // validações simples de campos obrigatórios
    const { name, email, password, phone } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
        return (0, responses_1.sendError)(res, 'Email já cadastrado.', 409);
    const password_hash = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, phone, password_hash, role: client_1.UserRole.CLIENTE }
    });
    return (0, responses_1.sendSuccess)(res, { id: user.id, name: user.name, email: user.email }, 201);
});
// POST /api/auth/login
exports.router.post('/login', (0, validate_1.validateBody)(auth_schemas_1.loginSchema), async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return (0, responses_1.sendError)(res, 'Usuário não encontrado.', 401);
    const ok = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!ok)
        return (0, responses_1.sendError)(res, 'Senha incorreta.', 401);
    const token = (0, jwt_1.signJwt)({ sub: user.id, role: user.role });
    return (0, responses_1.sendSuccess)(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
