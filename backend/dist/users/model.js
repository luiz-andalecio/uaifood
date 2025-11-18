"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = findUserById;
exports.findUserByEmail = findUserByEmail;
exports.listUsers = listUsers;
exports.countUsers = countUsers;
exports.updateUser = updateUser;
exports.updateUserRole = updateUserRole;
exports.softDeleteUser = softDeleteUser;
// model de usuarios: funcoes de acesso a dados via Prisma
const prisma_1 = require("../core/prisma");
function findUserById(id) {
    return prisma_1.prisma.user.findUnique({ where: { id } });
}
function findUserByEmail(email) {
    return prisma_1.prisma.user.findUnique({ where: { email } });
}
function listUsers(activeOnly = true, page = 1, pageSize = 20) {
    const skip = Math.max(0, (page - 1) * pageSize);
    return prisma_1.prisma.user.findMany({
        where: activeOnly ? { is_active: true } : {},
        orderBy: { created_at: 'desc' },
        skip,
        take: pageSize,
        select: { id: true, name: true, email: true, role: true }
    });
}
function countUsers(activeOnly = true) {
    return prisma_1.prisma.user.count({ where: activeOnly ? { is_active: true } : {} });
}
function updateUser(id, data) {
    return prisma_1.prisma.user.update({ where: { id }, data });
}
function updateUserRole(id, role) {
    return prisma_1.prisma.user.update({ where: { id }, data: { role } });
}
function softDeleteUser(id) {
    return prisma_1.prisma.user.update({ where: { id }, data: { is_active: false, deleted_at: new Date() } });
}
