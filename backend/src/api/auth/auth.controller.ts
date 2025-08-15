import { Request, Response } from 'express'
import { authService } from './auth.service'
import { logger } from '../../services/logger.service'
import { CredentialsTSModel } from '../../models/typescript/credentials.model'
import { userService } from '../user/user.service'

export async function sendOTP(req: Request, res: Response): Promise<void> {
  const { phone } = req.body

  try {
    let user = await userService.getByPhone(phone)
    if (!user) {
      const credentials : CredentialsTSModel = { phone }
      user = await userService.add(credentials)
    }
    const otpString = await authService.setOTP(user._id.toString())
    res.send(otpString)

  } catch (err: any) {
    logger.error('failed to send OTP:', err.message)
    res.status(500).send('Failed to send OTP')
  }
}