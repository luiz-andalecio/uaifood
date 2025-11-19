"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = verifyUser;
exports.isAdmin = isAdmin;
exports.isRoot = isRoot;
exports.verifyUserProfile = verifyUserProfile;
const jwt_1 = require("./jwt");
const prisma_1 = require("./prisma");
// lê somente o header 'x-access-token'
function getTokenFromRequest(req) {
    const headerToken = req.headers['x-access-token']?.trim();
    return headerToken || null;
}
// verifyUser: valida o JWT e coloca dados mínimos do usuário na requisição
function verifyUser(req, res, next) {
    const token = getTokenFromRequest(req);
    if (!token)
        return res.status(401).json({ message: 'Operação não permitida' });
    try {
        const payload = (0, jwt_1.verifyJwt)(token);
        req.user = { id: payload.sub, role: payload.role };
        req.userId = payload.sub;
        next();
    }
    catch (_err) {
        return res.status(401).json({ message: 'Operação não permitida' });
    }
}
// (remoção de alias verifyToken: usar apenas verifyUser nas rotas)
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
// verifyUserProfile: usado em fluxos pontuais para confirmar se o token atende a um perfil específico
async function verifyUserProfile(token, requiredRole) {
    try {
        const payload = (0, jwt_1.verifyJwt)(token);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: String(payload.sub) } });
        if (!user)
            return Promise.reject({ status: 401, message: 'Usuário não encontrado.' });
        if (user.role === requiredRole || user.role === 'ROOT')
            return { userId: user.id };
        return Promise.reject({ status: 403, message: 'Usuário não tem permissão para acessar o recurso.' });
    }
    catch (err) {
        return Promise.reject({ status: 401, message: err.message || 'Token inválido!' });
    }
}
