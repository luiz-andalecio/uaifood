"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// servidor HTTP principal do backend UAIFood
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const index_1 = require("./routes/index");
dotenv_1.default.config();
const app = (0, express_1.default)();
// middlewares globais
app.use((0, helmet_1.default)()); // seguranca basica
app.use((0, cors_1.default)()); // habilita CORS para o frontend
app.use(express_1.default.json()); // payload JSON
app.use((0, morgan_1.default)('dev')); // logs de requisicoes
// documentacao Swagger (OpenAPI) carregada de arquivo YAML
const swaggerPath = path_1.default.join(__dirname, 'swagger.yaml');
if (fs_1.default.existsSync(swaggerPath)) {
    const swaggerDocument = yaml_1.default.parse(fs_1.default.readFileSync(swaggerPath, 'utf-8'));
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
}
app.get('/health', (_, res) => res.json({ status: 'ok' }));
// rotas da API
app.use('/api', index_1.router);
const PORT = Number(process.env.PORT || 3333);
app.listen(PORT, () => {
    console.log(`UAIFood backend rodando em http://localhost:${PORT}`);
    console.log(`Swagger (se habilitado) em http://localhost:${PORT}/docs`);
});
