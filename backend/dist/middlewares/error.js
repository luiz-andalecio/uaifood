"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
// handler global simples para erros não tratados
function errorHandler(err, _req, res, _next) {
    console.error('[UnhandledError]', err?.message || err);
    if (process.env.NODE_ENV !== 'production' && err?.stack) {
        console.error(err.stack);
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
}
