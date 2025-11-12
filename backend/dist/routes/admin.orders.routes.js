"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// rotas administrativas de pedidos: listar, atualizar status e cancelar
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middlewares/auth");
const prisma = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// GET /api/admin/orders - lista pedidos com usuario e itens
exports.router.get('/', auth_1.verifyToken, auth_1.isAdmin, async (req, res) => {
    const { status } = req.query;
    const where = {};
    if (status)
        where.status = status; // sera validado pelo banco quando enum existir
    const orders = await prisma.order.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: {
            user: { select: { id: true, name: true, email: true } },
            items: { include: { item: true } }
        }
    });
    res.json({ orders });
});
// PATCH /api/admin/orders/:id/status - atualiza status do pedido
exports.router.patch('/:id/status', auth_1.verifyToken, auth_1.isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = Object.values(client_1.OrderStatus);
    if (!status || !allowed.includes(status)) {
        return res.status(400).json({ message: 'Status invalido.' });
    }
    try {
        const updated = await prisma.order.update({ where: { id }, data: { status: status } });
        return res.json({ id: updated.id, status: updated.status });
    }
    catch (e) {
        return res.status(404).json({ message: 'Pedido nao encontrado.' });
    }
});
// DELETE /api/admin/orders/:id - cancela um pedido
exports.router.delete('/:id', auth_1.verifyToken, auth_1.isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await prisma.order.update({
            where: { id },
            data: { cancelled_at: new Date(), status: client_1.OrderStatus.CANCELADO }
        });
        return res.json({ id: updated.id, cancelled_at: updated.cancelled_at });
    }
    catch (e) {
        return res.status(404).json({ message: 'Pedido nao encontrado.' });
    }
});
exports.default = exports.router;
