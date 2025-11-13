"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Centraliza leitura de variáveis de ambiente
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3333),
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-use-env',
};
exports.default = env;
