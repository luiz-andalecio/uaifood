"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// logger leve usando pino
const pino_1 = __importDefault(require("pino"));
const isProd = process.env.NODE_ENV === 'production';
exports.logger = (0, pino_1.default)(isProd
    ? { level: process.env.LOG_LEVEL || 'info' }
    : {
        level: 'debug',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                singleLine: true,
            },
        },
    });
exports.default = exports.logger;
