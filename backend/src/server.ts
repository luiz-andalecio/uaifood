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

// documentacao Swagger (OpenAPI) carregada de arquivo YAML
const swaggerPath = path.join(__dirname, 'swagger.yaml')
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = YAML.parse(fs.readFileSync(swaggerPath, 'utf-8'))
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

// rota de saude
import type { Request, Response } from 'express'
app.get('/health', (_: Request, res: Response) => res.json({ status: 'ok' }))

// rotas da API
app.use('/api', apiRouter)

const PORT = Number(process.env.PORT || 3333)
app.listen(PORT, () => {
  console.log(`UAIFood backend rodando em http://localhost:${PORT}`)
  console.log(`Swagger (se habilitado) em http://localhost:${PORT}/docs`)
})
