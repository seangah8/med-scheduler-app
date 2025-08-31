import { Request, Response, NextFunction } from 'express'
import { asyncLocalStorage } from '../services/als.service'


export function requireAuth(_req: Request, _res: Response, next: NextFunction): void {
  const store = asyncLocalStorage.getStore()

  if (!store?.loggedinUser) 
    return next({ status: 401, message: "Unauthorized: login required"})
  
  next()
}
