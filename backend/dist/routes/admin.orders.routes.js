"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// rotas administrativas de pedidos: listar, atualizar status e cancelar
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../core/auth");
const validate_1 = require("../core/validate");
const admin_schemas_1 = require("../validation/admin.schemas");
const responses_1 = require("../core/responses");
const prisma = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// GET /api/admin/orders - lista pedidos com usuario e itens
exports.router.get('/', auth_1.verifyUser, auth_1.isAdmin, async (req, res) => {
    const { status } = req.query;
    const where = {};
    if (status)
        where.status = status;
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
exports.router.patch('/:id/status', auth_1.verifyUser, auth_1.isAdmin, (0, validate_1.validateBody)(admin_schemas_1.setStatusSchema), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updated = await prisma.order.update({ where: { id }, data: { status } });
        return (0, responses_1.sendSuccess)(res, { id: updated.id, status: updated.status });
    }
    catch (e) {
        return (0, responses_1.sendError)(res, 'Pedido nao encontrado.', 404);
    }
});
// DELETE /api/admin/orders/:id - cancela um pedido
exports.router.delete('/:id', auth_1.verifyUser, auth_1.isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await prisma.order.update({
            where: { id },
            data: { cancelled_at: new Date(), status: client_1.OrderStatus.CANCELADO }
        });
        return (0, responses_1.sendSuccess)(res, { id: updated.id, cancelled_at: updated.cancelled_at });
    }
    catch (e) {
        return (0, responses_1.sendError)(res, 'Pedido nao encontrado.', 404);
    }
});
exports.default = exports.router;
