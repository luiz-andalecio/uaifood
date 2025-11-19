"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyOrders = listMyOrders;
exports.createOrder = createOrder;
const responses_1 = require("../core/responses");
const model_1 = require("./model");
async function listMyOrders(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return (0, responses_1.sendError)(res, 'Não autenticado.', 401);
    const orders = await (0, model_1.findOrdersByUser)(userId);
    return (0, responses_1.sendSuccess)(res, { orders });
}
async function createOrder(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return (0, responses_1.sendError)(res, 'Não autenticado.', 401);
    const { tableNumber, paymentMethod, items } = req.body;
    const ids = items.map((i) => i.itemId);
    const dbItems = await (0, model_1.findActiveItemsByIds)(ids);
    if (dbItems.length !== ids.length)
        return (0, responses_1.sendError)(res, 'Itens inválidos ou inativos.', 400);
    let subtotal = 0;
    const orderItemsData = items.map((i) => {
        const found = dbItems.find((d) => d.id === i.itemId);
        const unit = Number(found.price);
        const qty = Math.max(1, Number(i.quantity || 1));
        const total = unit * qty;
        subtotal += total;
        return { item_id: i.itemId, quantity: qty, unit_price: unit, total_price: total };
    });
    const tax = Number((subtotal * 0.0).toFixed(2));
    const total = subtotal + tax;
    const created = await (0, model_1.createOrderWithItems)({
        userId,
        tableNumber: tableNumber || null,
        paymentMethod: paymentMethod,
        subtotal,
        tax,
        total,
        items: orderItemsData,
    });
    return (0, responses_1.sendSuccess)(res, { id: created.id, total: created.total }, 201);
}
