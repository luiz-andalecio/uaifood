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
const prisma = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// POST /api/auth/register
exports.router.post('/register', async (req, res) => {
    // validações simples de campos obrigatórios
    let { name, email, password, phone } = req.body;
    email = (email ?? '').trim().toLowerCase();
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
        return res.status(409).json({ message: 'Email já cadastrado.' });
    const password_hash = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, phone, password_hash, role: client_1.UserRole.CLIENTE }
    });
    return res.status(201).json({ id: user.id, name: user.name, email: user.email });
});
// POST /api/auth/login
exports.router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    email = (email ?? '').trim().toLowerCase();
    if (!email || !password)
        return res.status(400).json({ message: 'Credenciais inválidas.' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ message: 'Usuário não encontrado.' });
    const ok = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!ok)
        return res.status(401).json({ message: 'Senha incorreta.' });
    const token = (0, jwt_1.signJwt)({ sub: user.id, role: user.role });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
