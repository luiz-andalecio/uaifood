"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
// handler global simples para erros não tratados
function errorHandler(err, _req, res, _next) {
    console.error('[UnhandledError]', err.message);
    if (process.env.NODE_ENV !== 'production' && err.stack) {
        console.error(err.stack);
    }
    const status = typeof err.status === 'number' ? err.status : 500;
    return res.status(status).json({ message: status === 500 ? 'Erro interno do servidor.' : err.message });
}
