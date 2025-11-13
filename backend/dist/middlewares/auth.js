"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.isAdmin = isAdmin;
exports.isRoot = isRoot;
const jwt_1 = require("../core/jwt");
function verifyToken(req, res, next) {
    // extrai token do header Authorization: Bearer <token>
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ message: 'Token ausente.' });
    const [, token] = auth.split(' ');
    try {
        const payload = (0, jwt_1.verifyJwt)(token);
        req.user = { id: payload.sub, role: payload.role };
        return next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}
function isAdmin(req, res, next) {
    const user = req.user;
    if (!user)
        return res.status(401).json({ message: 'Não autenticado.' });
    if (user.role === 'ADMIN' || user.role === 'ROOT')
        return next();
    return res.status(403).json({ message: 'Acesso restrito a administradores.' });
}
function isRoot(req, res, next) {
    const user = req.user;
    if (!user)
        return res.status(401).json({ message: 'Não autenticado.' });
    if (user.role === 'ROOT')
        return next();
    return res.status(403).json({ message: 'Acesso restrito ao ROOT.' });
}
