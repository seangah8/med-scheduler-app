import { Request, Response, NextFunction } from 'express'
import { logger } from '../services/logger.service'

export function log(req: Request, _res: Response, next: NextFunction) {
  logger.info(`visited route:, ${req.route?.path || req.url}`)
  next()
}