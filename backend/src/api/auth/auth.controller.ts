import { Request, Response } from 'express'
import { authService } from './auth.service'
import { logger } from '../../services/logger.service'
import { CredentialsTSModel } from '../../models/typescript/credentials.model'
import { userService } from '../user/user.service'
import { ENV } from '../../config/env'
import jwt from 'jsonwebtoken'

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
    logger.error(`failed to send OTP: ${err.message}`)
    res.status(500).send('Failed to send OTP')
  }
}

export async function verifyOTP(req: Request, res: Response): Promise<void> {
  const { phone, password } = req.body

  try {
    if (!phone || !password) 
      throw new Error('Phone and OTP are required')

    const user = await userService.getByPhone(phone)
    if (!user) throw Error('User not found')

    await authService.checkOTP(user._id.toString(), password)

    // create token
    const token = jwt.sign({ userId: user._id }, 
      ENV.JWT_SECRET, { expiresIn: '1h' })

    // send cookie
    res.cookie('loginToken', token, {
      httpOnly: true,
      secure: true,     
      maxAge: 1000 * 60 * 60, // 1 hour existance
    })

    res.send(user)

  } catch (err: any) {
    logger.error(`OTP verification failed: ${err.message}`)
    res.status(500).send('Failed to verify OTP')
  }
}
