"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
const responses_1 = require("./responses");
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
            return (0, responses_1.sendValidationError)(res, errors);
        }
        // substitui body normalizado
        req.body = result.data;
        next();
    };
}
