"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// rotas de pedidos: criar e listar pedidos do usuario autenticado
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middlewares/auth");
const prisma = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// GET /api/orders - lista pedidos do usuario atual
exports.router.get('/', auth_1.verifyToken, async (req, res) => {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        include: { items: { include: { item: true } } }
    });
    res.json({ orders });
});
// POST /api/orders - cria um novo pedido a partir do carrinho
exports.router.post('/', auth_1.verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { tableNumber, paymentMethod, items } = req.body;
    if (!tableNumber || tableNumber.trim() === '') {
        return res.status(400).json({ message: 'Informe o numero da mesa.' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Itens do pedido sao obrigatorios.' });
    }
    // carrega itens do cardapio para obter precos atuais
    const ids = items.map((i) => i.itemId);
    const dbItems = await prisma.item.findMany({ where: { id: { in: ids }, is_active: true } });
    if (dbItems.length !== ids.length)
        return res.status(400).json({ message: 'Alguns itens sao invalidos ou inativos.' });
    // calcula totais
    let subtotal = 0;
    const orderItemsData = items.map((i) => {
        const found = dbItems.find((d) => d.id === i.itemId);
        const unit = Number(found.price);
        const qty = Math.max(1, Number(i.quantity || 1));
        const total = unit * qty;
        subtotal += total;
        return {
            item_id: i.itemId,
            quantity: qty,
            unit_price: unit,
            total_price: total
        };
    });
    const tax = Number((subtotal * 0.0).toFixed(2)); // sem impostos por enquanto
    const total = subtotal + tax;
    // cria pedido e itens em transacao
    const created = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                user_id: userId,
                table_number: tableNumber || null,
                payment_method: paymentMethod ? paymentMethod : null,
                subtotal,
                tax,
                total,
                status: client_1.OrderStatus.PENDENTE
            }
        });
        await tx.orderItem.createMany({
            data: orderItemsData.map((oi) => ({ ...oi, order_id: order.id }))
        });
        return order;
    });
    res.status(201).json({ id: created.id, total: created.total });
});
