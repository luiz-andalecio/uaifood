"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middlewares/auth");
const prisma = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// GET /api/admin/dashboard - métricas simples
exports.router.get('/dashboard', auth_1.verifyToken, auth_1.isAdmin, async (_req, res) => {
    const [users, items, orders] = await Promise.all([
        prisma.user.count({ where: { is_active: true } }),
        prisma.item.count({ where: { is_active: true } }),
        prisma.order.count()
    ]);
    return res.json({ users, items, orders });
});
