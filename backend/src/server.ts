// servidor HTTP principal do backend UAIFood
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

import { router as apiRouter } from './routes/index'

dotenv.config()

const app = express()

// middlewares globais
app.use(helmet()) // seguranca basica
app.use(cors()) // habilita CORS para o frontend
app.use(express.json()) // payload JSON
app.use(morgan('dev')) // logs de requisicoes

// documentação Swagger (OpenAPI) carregada via YAML
let swaggerDocument: any | null = null
try {
  const candidates = [
    path.join(__dirname, 'swagger.yaml'), // dev com ts-node (src)
    path.join(__dirname, '../src/swagger.yaml'), // prod compilado (dist -> src)
    path.join(process.cwd(), 'backend', 'src', 'swagger.yaml'),
    path.join(process.cwd(), 'src', 'swagger.yaml'),
    path.join(process.cwd(), 'swagger.yaml'),
  ]

  const found = candidates.find((p) => fs.existsSync(p))
  if (found) {
    swaggerDocument = YAML.parse(fs.readFileSync(found, 'utf-8'))
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    // rota auxiliar para depuração do documento
    app.get('/docs.json', (_req, res) => res.json(swaggerDocument))
    // garantir acesso com barra final
    app.get('/docs/', (_req, res) => res.redirect('/docs'))
    console.log(`Swagger carregado: ${found}`)
  } else {
    console.warn('Arquivo swagger.yaml não encontrado em caminhos conhecidos. /docs indisponível.')
  }
} catch (err) {
  console.error('Falha ao carregar documentação OpenAPI:', (err as Error).message)
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

const PORT = Number(process.env.PORT || 3333)
app.listen(PORT, () => {
  console.log(`UAIFood backend rodando em http://localhost:${PORT}`)
  console.log(`Swagger (se habilitado) em http://localhost:${PORT}/docs`)
})
