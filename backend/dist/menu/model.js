"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listActiveMenu = listActiveMenu;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.softDeleteItem = softDeleteItem;
// model de menu: categorias e itens
const prisma_1 = require("../core/prisma");
function listActiveMenu() {
    return prisma_1.prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { items: { where: { is_active: true }, orderBy: { name: 'asc' } } },
    });
}
function createItem(data) {
    const { name, price, categoryId, description, image_url } = data;
    return prisma_1.prisma.item.create({ data: { name, price, category_id: categoryId, description, image_url } });
}
function updateItem(id, data) {
    return prisma_1.prisma.item.update({ where: { id }, data });
}
function softDeleteItem(id) {
    return prisma_1.prisma.item.update({ where: { id }, data: { is_active: false, deleted_at: new Date() } });
}
