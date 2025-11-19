"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrdersByUser = findOrdersByUser;
exports.findActiveItemsByIds = findActiveItemsByIds;
exports.createOrderWithItems = createOrderWithItems;
// model de pedidos: consultas e escrita via Prisma
const prisma_1 = require("../core/prisma");
const client_1 = require("@prisma/client");
function findOrdersByUser(userId) {
    return prisma_1.prisma.order.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        include: { items: { include: { item: true } } },
    });
}
function findActiveItemsByIds(ids) {
    return prisma_1.prisma.item.findMany({ where: { id: { in: ids }, is_active: true } });
}
async function createOrderWithItems(params) {
    const { userId, tableNumber, paymentMethod, subtotal, tax, total, items } = params;
    const created = await prisma_1.prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                user_id: userId,
                table_number: tableNumber,
                payment_method: paymentMethod,
                subtotal,
                tax,
                total,
                status: client_1.OrderStatus.PENDENTE,
            },
        });
        await tx.orderItem.createMany({ data: items.map((oi) => ({ ...oi, order_id: order.id })) });
        return order;
    });
    return created;
}
