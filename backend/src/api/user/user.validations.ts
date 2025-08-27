import { Request, Response, NextFunction } from 'express'
import { asyncLocalStorage } from '../../services/als.service'


export function validatePhone(req: Request, res: Response, next: NextFunction) {

  // accepts 05 followed by 8 digits
  const phoneRegex = /^05\d{8}$/
  const phone = req.body?.phone || req.params?.phone

  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).send('invalid phone number')
  }

  next()
}


export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const store = asyncLocalStorage.getStore()

  if (!store?.loggedinUser) {
    res.status(401).send('Unauthorized: login required')
    return
  }

  next()
}
