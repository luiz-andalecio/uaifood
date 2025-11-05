"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// rotas de perfil do usuario: obter, atualizar e trocar senha
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middlewares/auth");
const prisma = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// GET /api/users/me - dados do usuario logado
exports.router.get('/me', auth_1.verifyToken, async (req, res) => {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    const u = user;
    return res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, address: u.address ?? null, zip_code: u.zip_code ?? null });
});
// PATCH /api/users/me - atualizar dados basicos (nome, email, telefone, endereco). Exige senha se email mudar.
exports.router.patch('/me', auth_1.verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { name, email, phone, address, zip_code, password } = req.body;
    if (!name && !email && !phone && !address && !zip_code) {
        return res.status(400).json({ message: 'Nada para atualizar.' });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    // sempre exige confirmação de senha para alterações de perfil
    if (!password)
        return res.status(400).json({ message: 'Confirme sua senha para salvar as alterações.' });
    {
        const ok = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!ok)
            return res.status(401).json({ message: 'Senha atual inválida.' });
    }
    try {
        const data = { name, email, phone, address, zip_code };
        const updated = await prisma.user.update({
            where: { id: userId },
            data
        });
        const u = updated;
        return res.json({ id: updated.id, name: updated.name, email: updated.email, phone: updated.phone, address: u.address ?? null, zip_code: u.zip_code ?? null });
    }
    catch (e) {
        if (e.code === 'P2002') {
            return res.status(400).json({ message: 'Este e-mail já está em uso.' });
        }
        return res.status(500).json({ message: 'Erro ao atualizar usuário.' });
    }
});
// POST /api/users/me/change-password - trocar senha via modal
exports.router.post('/me/change-password', auth_1.verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword)
        return res.status(400).json({ message: 'Preencha todas as senhas.' });
    if (newPassword.length < 8)
        return res.status(400).json({ message: 'Nova senha deve ter pelo menos 8 caracteres.' });
    if (newPassword !== confirmPassword)
        return res.status(400).json({ message: 'As senhas novas não conferem.' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    const ok = await bcryptjs_1.default.compare(currentPassword, user.password_hash);
    if (!ok)
        return res.status(401).json({ message: 'Senha atual inválida.' });
    const password_hash = await bcryptjs_1.default.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password_hash } });
    return res.json({ message: 'Senha alterada com sucesso.' });
});
exports.default = exports.router;
// ----- Rotas administrativas de usuários -----
// Observação: mantidas no mesmo arquivo para simplicidade e porque já montamos em /api/users no router principal.
// GET /api/users - lista usuários (admin/root), com paginação simples
exports.router.get('/', auth_1.verifyToken, auth_1.isAdmin, async (req, res) => {
    const page = Math.max(parseInt(String((req.query.page ?? '1'))), 1);
    const pageSize = Math.max(Math.min(parseInt(String((req.query.pageSize ?? '20'))), 100), 1);
    const skip = (page - 1) * pageSize;
    const [total, users] = await Promise.all([
        prisma.user.count({ where: { is_active: true } }),
        prisma.user.findMany({
            where: { is_active: true },
            orderBy: { created_at: 'desc' },
            skip,
            take: pageSize,
            select: { id: true, name: true, email: true, role: true }
        })
    ]);
    return res.json({ total, page, pageSize, users });
});
// PATCH /api/users/:id/role - altera papel (apenas ROOT)
exports.router.patch('/:id/role', auth_1.verifyToken, auth_1.isRoot, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !['CLIENTE', 'ADMIN', 'ROOT'].includes(role)) {
        return res.status(400).json({ message: 'Role inválida.' });
    }
    const meId = req.user.id;
    // opcional: impedir que o usuário mude o próprio papel para evitar lock-out acidental
    if (id === meId) {
        return res.status(400).json({ message: 'Não é permitido alterar o próprio papel.' });
    }
    const updated = await prisma.user.update({ where: { id }, data: { role } });
    return res.json({ id: updated.id, name: updated.name, email: updated.email, role: updated.role });
});
// POST /api/users/:id/password - redefine senha de um usuário (ADMIN/ROOT)
exports.router.post('/:id/password', auth_1.verifyToken, auth_1.isAdmin, async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    if (!password || password.length < 8) {
        return res.status(400).json({ message: 'Senha deve ter no mínimo 8 caracteres.' });
    }
    const password_hash = await bcryptjs_1.default.hash(password, 10);
    await prisma.user.update({ where: { id }, data: { password_hash } });
    return res.json({ message: 'Senha atualizada com sucesso.' });
});
// DELETE /api/users/:id - desativa usuário (admin/root)
exports.router.delete('/:id', auth_1.verifyToken, auth_1.isAdmin, async (req, res) => {
    const { id } = req.params;
    const meId = req.user.id;
    if (id === meId) {
        return res.status(400).json({ message: 'Não é permitido desativar a si mesmo.' });
    }
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    await prisma.user.update({ where: { id }, data: { is_active: false, deleted_at: new Date() } });
    return res.status(204).send();
});
