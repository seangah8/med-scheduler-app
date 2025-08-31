import { Request, Response} from "express"
import { logger } from "../services/logger.service"

export function errorHandler(err: any, req: Request, res: Response) {
    
  logger.error(
    `Error in ${req.method} ${req.path}: ${err.message}\n` +
    `Stack: ${err.stack}\n` +
    `Body: ${JSON.stringify(req.body)}\n` +
    `Params: ${JSON.stringify(req.params)}`
  )

  // prevent leak sensitive info in production
  const isDev = process.env.NODE_ENV !== 'production'

  res.status(err.status || 500).json({
    error: isDev ? err.message : 'An error occurred',
    ...(isDev && { stack: err.stack })
  })
}
