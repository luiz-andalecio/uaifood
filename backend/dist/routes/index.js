"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// router principal da API
const express_1 = require("express");
const auth_routes_1 = require("./auth.routes");
const profile_routes_1 = require("./profile.routes");
const menu_routes_1 = require("./menu.routes");
const orders_routes_1 = require("./orders.routes");
const metrics_routes_1 = require("./metrics.routes");
const admin_orders_routes_1 = require("./admin.orders.routes");
exports.router = (0, express_1.Router)();
// versão da API
exports.router.get('/', (_, res) => res.json({ name: 'UAIFood API', version: 'v1' }));
exports.router.use('/auth', auth_routes_1.router);
exports.router.use('/users', profile_routes_1.router);
exports.router.use('/menu', menu_routes_1.router);
exports.router.use('/orders', orders_routes_1.router);
exports.router.use('/admin', metrics_routes_1.router);
exports.router.use('/admin/orders', admin_orders_routes_1.router);
