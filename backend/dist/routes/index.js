"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// router principal da API
const express_1 = require("express");
const auth_routes_1 = require("./auth.routes");
const routes_1 = require("../users-profile/routes");
const routes_2 = require("../menu/routes");
const routes_3 = require("../orders/routes");
const metrics_routes_1 = require("./metrics.routes");
const admin_orders_routes_1 = require("./admin.orders.routes");
exports.router = (0, express_1.Router)();
// versão da API
exports.router.get('/', (_, res) => res.json({ name: 'UAIFood API', version: 'v1' }));
exports.router.use('/auth', auth_routes_1.router);
exports.router.use('/users', routes_1.router);
exports.router.use('/menu', routes_2.router);
exports.router.use('/orders', routes_3.router);
exports.router.use('/admin', metrics_routes_1.router);
exports.router.use('/admin/orders', admin_orders_routes_1.router);
