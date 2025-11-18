// logger leve usando pino
import pino from 'pino'

const isProd = process.env.NODE_ENV === 'production'

export const logger = pino(
  isProd
    ? { level: process.env.LOG_LEVEL || 'info' }
    : {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            singleLine: true,
          },
        },
      }
)

export default logger
