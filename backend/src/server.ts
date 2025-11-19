// servidor HTTP principal do backend UAIFood
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import env from './config/env'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import type { OpenAPIV3 } from 'openapi-types'

import { router as apiRouter } from './routes/index'
import { errorHandler } from './core/errorHandler'
import logger from './core/logger'

const app = express()

// middlewares globais
app.use(helmet()) // seguranca basica
app.use(cors()) // habilita CORS para o frontend
app.use(express.json()) // payload JSON
app.use(morgan('dev')) // logs de requisicoes

// documentação Swagger (OpenAPI) carregada via YAML (suporta arquivo único ou pasta com múltiplos arquivos e $ref)
let swaggerDocument: OpenAPIV3.Document | null = null
try {
  // Primeiro tenta o modelo multi-arquivos: backend/src/swagger/index.yaml (ou caminhos equivalentes)
  const folderCandidates = [
    path.join(__dirname, 'swagger', 'index.yaml'), // dev com ts-node (src)
    path.join(__dirname, '../src/swagger', 'index.yaml'), // prod compilado (dist -> src)
    path.join(process.cwd(), 'backend', 'src', 'swagger', 'index.yaml'),
    path.join(process.cwd(), 'src', 'swagger', 'index.yaml'),
  ]
  const folderFound = folderCandidates.find((p) => fs.existsSync(p))

  if (folderFound) {
    const folder = path.dirname(folderFound)
    // Servimos os arquivos YAML estaticamente em /docs-spec
    app.use('/docs-spec', express.static(folder))
    // E a UI do Swagger consome o index.yaml via URL (assim o Swagger resolve $ref relativos via HTTP)
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: '/docs-spec/index.yaml' }))
    // endpoint opcional para obter o index bruto (sem resolver refs)
    app.get('/docs.json', (_req, res) => {
      try {
        const raw = fs.readFileSync(folderFound, 'utf-8')
        const parsed = YAML.parse(raw)
        res.json(parsed)
      } catch (e) {
        res.status(500).json({ ok: false, message: 'Falha ao ler index.yaml', error: String(e) })
      }
    })
    app.get('/docs/', (_req, res) => res.redirect('/docs'))
    logger.info({ swaggerIndex: folderFound }, 'Swagger (multi-arquivos) carregado')
  } else {
    // Fallback: arquivo único swagger.yaml em caminhos conhecidos
    const singleFileCandidates = [
      path.join(__dirname, 'swagger.yaml'), // dev com ts-node (src)
      path.join(__dirname, '../src/swagger.yaml'), // prod compilado (dist -> src)
      path.join(process.cwd(), 'backend', 'src', 'swagger.yaml'),
      path.join(process.cwd(), 'src', 'swagger.yaml'),
      path.join(process.cwd(), 'swagger.yaml'),
    ]

    const found = singleFileCandidates.find((p) => fs.existsSync(p))
    if (found) {
      swaggerDocument = YAML.parse(fs.readFileSync(found, 'utf-8'))
      app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
      app.get('/docs.json', (_req, res) => res.json(swaggerDocument))
      app.get('/docs/', (_req, res) => res.redirect('/docs'))
      logger.info({ swagger: found }, 'Swagger (arquivo único) carregado')
    } else {
      logger.warn('Arquivo/pasta do Swagger não encontrado. /docs indisponível.')
    }
  }
} catch (err) {
  logger.error({ err }, 'Falha ao carregar documentação OpenAPI')
}

// rota de saude
import type { Request, Response } from 'express'
app.get('/health', (_: Request, res: Response) => res.json({ status: 'ok' }))
// redireciona raiz para documentação se disponível
app.get('/', (_: Request, res: Response) => {
  if (swaggerDocument) return res.redirect('/docs')
  return res.status(404).json({ message: 'Rota não encontrada.' })
})

// rotas da API
app.use('/api', apiRouter)

// handler global de erros (precisa ser o último middleware)
app.use(errorHandler)

const PORT = env.port
app.listen(PORT, () => {
  logger.info(`UAIFood backend rodando em http://localhost:${PORT}`)
  logger.info(`Swagger (se habilitado) em http://localhost:${PORT}/docs`)
})
