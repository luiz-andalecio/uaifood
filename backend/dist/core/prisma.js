"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// instancia compartilhada do Prisma para evitar multiplas conexoes
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
