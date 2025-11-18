"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// rotas de cardápio (públicas e administrativas)
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../core/validate");
const menu_schemas_1 = require("../validation/menu.schemas");
const controller_1 = require("./controller");
const prisma = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// GET /api/menu - lista categorias e itens ativos
exports.router.get('/', controller_1.getMenu);
exports.router.post('/items', auth_1.verifyToken, auth_1.isAdmin, (0, validate_1.validateBody)(menu_schemas_1.createItemSchema), controller_1.createMenuItem);
exports.router.patch('/items/:id', auth_1.verifyToken, auth_1.isAdmin, (0, validate_1.validateBody)(menu_schemas_1.updateItemSchema), controller_1.patchMenuItem);
exports.router.delete('/items/:id', auth_1.verifyToken, auth_1.isAdmin, controller_1.deleteMenuItem);
