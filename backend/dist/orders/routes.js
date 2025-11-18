"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// rotas de pedidos: criar e listar pedidos do usuario autenticado
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../core/validate");
const controller_1 = require("./controller");
const orders_schemas_1 = require("../validation/orders.schemas");
const prisma = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// GET /api/orders - lista pedidos do usuario atual
exports.router.get('/', auth_1.verifyToken, controller_1.listMyOrders);
exports.router.post('/', auth_1.verifyToken, (0, validate_1.validateBody)(orders_schemas_1.createOrderSchema), controller_1.createOrder);
