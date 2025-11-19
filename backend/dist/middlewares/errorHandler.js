"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = __importDefault(require("../core/logger"));
function errorHandler(err, _req, res, _next) {
    const status = typeof err?.status === 'number' ? err.status : 500;
    const code = err?.code || 'INTERNAL_ERROR';
    const message = err?.message || 'Erro interno do servidor.';
    // log estruturado
    logger_1.default.error({ err, status, code }, message);
    if (res.headersSent)
        return;
    res.status(status).json({ ok: false, code, message });
}
exports.default = errorHandler;
