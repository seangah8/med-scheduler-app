import { Request, Response, NextFunction } from 'express'

export function validatePhone(req: Request, res: Response, next: NextFunction) {

  // accepts 0 followed by 9 digits
  const phoneRegex = /^0\d{9}$/
  const phone = req.body?.phone || req.params?.phone

  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).send('invalid phone number')
  }

  next()
}
