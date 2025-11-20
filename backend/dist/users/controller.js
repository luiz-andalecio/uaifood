"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.updateMe = updateMe;
exports.changeMyPassword = changeMyPassword;
exports.adminListUsers = adminListUsers;
exports.adminSetRole = adminSetRole;
exports.adminResetPassword = adminResetPassword;
exports.adminDeleteUser = adminDeleteUser;
// controller de usuários: regras simples
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const responses_1 = require("../core/responses");
const model_1 = require("./model");
async function getMe(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return (0, responses_1.sendError)(res, 'Não autenticado.', 401);
    const user = await (0, model_1.findUserById)(userId);
    if (!user)
        return (0, responses_1.sendError)(res, 'Usuário não encontrado.', 404);
    return (0, responses_1.sendSuccess)(res, { id: user.id, name: user.name, email: user.email, phone: user.phone ?? null, role: user.role, address: user.address ?? null, zip_code: user.zip_code ?? null });
}
async function updateMe(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return (0, responses_1.sendError)(res, 'Não autenticado.', 401);
    const { name, email, phone, address, zip_code, password } = req.body;
    if (!name && !email && !phone && !address && !zip_code)
        return (0, responses_1.sendError)(res, 'Nenhum campo informado.', 400);
    if (!password)
        return (0, responses_1.sendError)(res, 'Confirme sua senha para salvar as alterações.', 400);
    const current = await (0, model_1.findUserById)(userId);
    if (!current)
        return (0, responses_1.sendError)(res, 'Usuário não encontrado.', 404);
    const ok = await bcryptjs_1.default.compare(password, current.password_hash);
    if (!ok)
        return (0, responses_1.sendError)(res, 'Senha atual inválida.', 401);
    try {
        const updated = await (0, model_1.updateUser)(userId, { name, email, phone, address, zip_code });
        return (0, responses_1.sendSuccess)(res, {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone ?? null,
            role: updated.role,
            address: updated.address ?? null,
            zip_code: updated.zip_code ?? null,
        });
    }
    catch (e) {
        if (e.code === 'P2002')
            return (0, responses_1.sendError)(res, 'Este e-mail já está em uso.', 400);
        return (0, responses_1.sendError)(res, 'Erro ao atualizar usuário.', 500);
    }
}
async function changeMyPassword(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return (0, responses_1.sendError)(res, 'Não autenticado.', 401);
    const { currentPassword, newPassword } = req.body;
    const user = await (0, model_1.findUserById)(userId);
    if (!user)
        return (0, responses_1.sendError)(res, 'Usuário não encontrado.', 404);
    const ok = await bcryptjs_1.default.compare(currentPassword, user.password_hash);
    if (!ok)
        return (0, responses_1.sendError)(res, 'Senha atual inválida.', 401);
    const password_hash = await bcryptjs_1.default.hash(newPassword, 10);
    const { prisma } = await Promise.resolve().then(() => __importStar(require('../core/prisma')));
    await prisma.user.update({ where: { id: userId }, data: { password_hash } });
    return (0, responses_1.sendSuccess)(res, { message: 'Senha alterada com sucesso.' });
}
async function adminListUsers(req, res) {
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const pageSize = Math.max(Math.min(Number(req.query.pageSize ?? 20), 100), 1);
    const [total, users] = await Promise.all([(0, model_1.countUsers)(true), (0, model_1.listUsers)(true, page, pageSize)]);
    return (0, responses_1.sendSuccess)(res, { total, page, pageSize, users });
}
async function adminSetRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !['CLIENTE', 'ADMIN', 'ROOT'].includes(role))
        return (0, responses_1.sendError)(res, 'Role inválida.', 400);
    const meId = req.user?.id;
    if (!meId)
        return (0, responses_1.sendError)(res, 'Não autenticado.', 401);
    if (id === meId)
        return (0, responses_1.sendError)(res, 'Não é permitido alterar o próprio papel.', 400);
    const updated = await (0, model_1.updateUserRole)(id, role);
    return (0, responses_1.sendSuccess)(res, { id: updated.id, name: updated.name, email: updated.email, role: updated.role });
}
async function adminResetPassword(req, res) {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;
    if (!password || password.length < 8)
        return (0, responses_1.sendError)(res, 'Senha mínima 8 caracteres.', 400);
    if (!confirmPassword || password !== confirmPassword)
        return (0, responses_1.sendError)(res, 'As senhas não conferem.', 400);
    const { prisma } = await Promise.resolve().then(() => __importStar(require('../core/prisma')));
    const password_hash = await bcryptjs_1.default.hash(password, 10);
    await prisma.user.update({ where: { id }, data: { password_hash } });
    return (0, responses_1.sendSuccess)(res, { message: 'Senha atualizada com sucesso.' });
}
async function adminDeleteUser(req, res) {
    const { id } = req.params;
    const meId = req.user?.id;
    if (!meId)
        return (0, responses_1.sendError)(res, 'Não autenticado.', 401);
    if (id === meId)
        return (0, responses_1.sendError)(res, 'Não é permitido desativar a si mesmo.', 400);
    const user = await (0, model_1.findUserById)(id);
    if (!user)
        return (0, responses_1.sendError)(res, 'Usuário não encontrado.', 404);
    if (user.role === 'ROOT')
        return (0, responses_1.sendError)(res, 'Não é permitido excluir o usuário ROOT.', 400);
    await (0, model_1.softDeleteUser)(id);
    return res.status(204).send();
}
