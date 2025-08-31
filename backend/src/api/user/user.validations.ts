import { Request, Response, NextFunction } from 'express'
import { asyncLocalStorage } from '../../services/als.service'


export function validatePhone(req: Request, _res: Response, next: NextFunction) {

  // accepts 05 followed by 8 digits
  const phoneRegex = /^05\d{8}$/
  const phone = req.body?.phone || req.params?.phone

  if (!phone || !phoneRegex.test(phone)) 
    return next({ status: 400, message: "Invalid phone number"})

  next()
}


export function requireAuth(_req: Request, _res: Response, next: NextFunction): void {
  const store = asyncLocalStorage.getStore()

  if (!store?.loggedinUser) 
    return next({ status: 401, message: "Unauthorized: login required"})
  
  next()
}
