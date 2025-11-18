"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenu = getMenu;
exports.createMenuItem = createMenuItem;
exports.patchMenuItem = patchMenuItem;
exports.deleteMenuItem = deleteMenuItem;
const responses_1 = require("../core/responses");
const model_1 = require("./model");
async function getMenu(_req, res) {
    const categories = await (0, model_1.listActiveMenu)();
    return (0, responses_1.sendSuccess)(res, { categories });
}
async function createMenuItem(req, res) {
    const { name, price, categoryId, description, image_url } = req.body;
    if (!name || price == null)
        return (0, responses_1.sendError)(res, 'Nome e preço são obrigatórios.', 400);
    const item = await (0, model_1.createItem)({ name, price, categoryId, description, image_url });
    return (0, responses_1.sendSuccess)(res, item, 201);
}
async function patchMenuItem(req, res) {
    const { id } = req.params;
    const data = req.body;
    const updated = await (0, model_1.updateItem)(id, data);
    return (0, responses_1.sendSuccess)(res, updated);
}
async function deleteMenuItem(req, res) {
    const { id } = req.params;
    await (0, model_1.softDeleteItem)(id);
    return res.status(204).send();
}
