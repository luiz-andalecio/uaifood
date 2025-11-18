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
const env_1 = __importDefault(require("./config/env"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const index_1 = require("./routes/index");
const errorHandler_1 = require("./middlewares/errorHandler");
const logger_1 = __importDefault(require("./core/logger"));
const app = (0, express_1.default)();
// middlewares globais
app.use((0, helmet_1.default)()); // seguranca basica
app.use((0, cors_1.default)()); // habilita CORS para o frontend
app.use(express_1.default.json()); // payload JSON
app.use((0, morgan_1.default)('dev')); // logs de requisicoes
// documentação Swagger (OpenAPI) carregada via YAML
let swaggerDocument = null;
try {
    const candidates = [
        path_1.default.join(__dirname, 'swagger.yaml'), // dev com ts-node (src)
        path_1.default.join(__dirname, '../src/swagger.yaml'), // prod compilado (dist -> src)
        path_1.default.join(process.cwd(), 'backend', 'src', 'swagger.yaml'),
        path_1.default.join(process.cwd(), 'src', 'swagger.yaml'),
        path_1.default.join(process.cwd(), 'swagger.yaml'),
    ];
    const found = candidates.find((p) => fs_1.default.existsSync(p));
    if (found) {
        swaggerDocument = yaml_1.default.parse(fs_1.default.readFileSync(found, 'utf-8'));
        app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
        // rota auxiliar para depuração do documento
        app.get('/docs.json', (_req, res) => res.json(swaggerDocument));
        // garantir acesso com barra final
        app.get('/docs/', (_req, res) => res.redirect('/docs'));
        logger_1.default.info({ swagger: found }, 'Swagger carregado');
    }
    else {
        logger_1.default.warn('Arquivo swagger.yaml não encontrado em caminhos conhecidos. /docs indisponível.');
    }
}
catch (err) {
    logger_1.default.error({ err }, 'Falha ao carregar documentação OpenAPI');
}
app.get('/health', (_, res) => res.json({ status: 'ok' }));
// redireciona raiz para documentação se disponível
app.get('/', (_, res) => {
    if (swaggerDocument)
        return res.redirect('/docs');
    return res.status(404).json({ message: 'Rota não encontrada.' });
});
// rotas da API
app.use('/api', index_1.router);
// handler global de erros (precisa ser o último middleware)
app.use(errorHandler_1.errorHandler);
const PORT = env_1.default.port;
app.listen(PORT, () => {
    logger_1.default.info(`UAIFood backend rodando em http://localhost:${PORT}`);
    logger_1.default.info(`Swagger (se habilitado) em http://localhost:${PORT}/docs`);
});
