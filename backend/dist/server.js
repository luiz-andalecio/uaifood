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
const errorHandler_1 = require("./core/errorHandler");
const logger_1 = __importDefault(require("./core/logger"));
const app = (0, express_1.default)();
// middlewares globais
app.use((0, helmet_1.default)()); // seguranca basica
app.use((0, cors_1.default)()); // habilita CORS para o frontend
app.use(express_1.default.json()); // payload JSON
app.use((0, morgan_1.default)('dev')); // logs de requisicoes
// documentação Swagger (OpenAPI) carregada via YAML (suporta arquivo único ou pasta com múltiplos arquivos e $ref)
let swaggerDocument = null;
try {
    // Primeiro tenta o modelo multi-arquivos: backend/src/swagger/index.yaml (ou caminhos equivalentes)
    const folderCandidates = [
        path_1.default.join(__dirname, 'swagger', 'index.yaml'), // dev com ts-node (src)
        path_1.default.join(__dirname, '../src/swagger', 'index.yaml'), // prod compilado (dist -> src)
        path_1.default.join(process.cwd(), 'backend', 'src', 'swagger', 'index.yaml'),
        path_1.default.join(process.cwd(), 'src', 'swagger', 'index.yaml'),
    ];
    const folderFound = folderCandidates.find((p) => fs_1.default.existsSync(p));
    if (folderFound) {
        const folder = path_1.default.dirname(folderFound);
        // Servimos os arquivos YAML estaticamente em /docs-spec
        app.use('/docs-spec', express_1.default.static(folder));
        // E a UI do Swagger consome o index.yaml via URL (assim o Swagger resolve $ref relativos via HTTP)
        app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, { swaggerUrl: '/docs-spec/index.yaml' }));
        // endpoint opcional para obter o index bruto (sem resolver refs)
        app.get('/docs.json', (_req, res) => {
            try {
                const raw = fs_1.default.readFileSync(folderFound, 'utf-8');
                const parsed = yaml_1.default.parse(raw);
                res.json(parsed);
            }
            catch (e) {
                res.status(500).json({ ok: false, message: 'Falha ao ler index.yaml', error: String(e) });
            }
        });
        app.get('/docs/', (_req, res) => res.redirect('/docs'));
        logger_1.default.info({ swaggerIndex: folderFound }, 'Swagger (multi-arquivos) carregado');
    }
    else {
        // Fallback: arquivo único swagger.yaml em caminhos conhecidos
        const singleFileCandidates = [
            path_1.default.join(__dirname, 'swagger.yaml'), // dev com ts-node (src)
            path_1.default.join(__dirname, '../src/swagger.yaml'), // prod compilado (dist -> src)
            path_1.default.join(process.cwd(), 'backend', 'src', 'swagger.yaml'),
            path_1.default.join(process.cwd(), 'src', 'swagger.yaml'),
            path_1.default.join(process.cwd(), 'swagger.yaml'),
        ];
        const found = singleFileCandidates.find((p) => fs_1.default.existsSync(p));
        if (found) {
            swaggerDocument = yaml_1.default.parse(fs_1.default.readFileSync(found, 'utf-8'));
            app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
            app.get('/docs.json', (_req, res) => res.json(swaggerDocument));
            app.get('/docs/', (_req, res) => res.redirect('/docs'));
            logger_1.default.info({ swagger: found }, 'Swagger (arquivo único) carregado');
        }
        else {
            logger_1.default.warn('Arquivo/pasta do Swagger não encontrado. /docs indisponível.');
        }
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
