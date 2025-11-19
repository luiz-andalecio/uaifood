"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendMessage = sendMessage;
exports.sendError = sendError;
exports.sendValidationError = sendValidationError;
function sendSuccess(res, data, status = 200) {
    return res.status(status).json({ ok: true, data });
}
function sendMessage(res, message, status = 200) {
    return res.status(status).json({ ok: true, message });
}
function sendError(res, message, status = 400, details) {
    const body = { ok: false, message };
    if (details !== undefined)
        body.details = details;
    return res.status(status).json(body);
}
function sendValidationError(res, errors, message = 'Dados inválidos.') {
    return res.status(422).json({ ok: false, message, errors });
}
