import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { authService } from './auth.service'
import { logger } from '../../services/logger.service'
import { CredentialsTSModel } from '../../models/typescript/credentials.model'
import { userService } from '../user/user.service'
import { ENV } from '../../config/env'
import { asyncLocalStorage } from '../../services/als.service'


export async function sendOTP(req: Request, res: Response, next: NextFunction): Promise<void> {

  const { phone } = req.body

  try {
    let user = await userService.getByPhone(phone)

    if (!user) {
      const credentials : CredentialsTSModel = { phone }
      user = await userService.add(credentials)
    }

    const otpStr = await authService.setOTP(user._id.toString())
    res.send(otpStr)

  } catch (err: any) {
    logger.error(`failed to send OTP: ${err.message}`)
    next({ status: 500, message: "Failed to send OTP", details: err })
  }
}

export async function verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { phone, password } = req.body

  try {
    const user = await userService.getByPhone(phone)
    if (!user) throw Error('User not found')

    const isCorrect = await authService.checkOTP(user._id.toString(), password)
    if(!isCorrect) res.send(null)

    // create token
    const token = jwt.sign({ userId: user._id }, 
      ENV.JWT_SECRET, { expiresIn: '2h' })

    // send cookie
    res.cookie('loginToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',     // for production
      maxAge: 1000 * 60 * 60 * 2, // 2 hour existance
    })

    res.send(user)

  } catch (err: any) {
    logger.error(`OTP verification failed: ${err.message}`)
    next({ status: 500, message: "Failed to verify OTP", details: err })
  }
}

export async function logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
  const store = asyncLocalStorage.getStore()
  const userId = store?.loggedinUser?.userId

  try {
    res.clearCookie('loginToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })

    logger.info(`User ${userId} logged out`)
    res.send({ message: 'Logged out successfully' })

  } catch (err: any) {
    logger.error(`Logout failed: ${err.message}`)
    next({ status: 400, message: "Logout failed", details: err })
  }
}

export async function getLoggedInUser(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = asyncLocalStorage.getStore()?.loggedinUser?.userId
    if (!userId) throw new Error('Not logged in')
      
    const user = await userService.getById(userId)
    if (!user) throw new Error('User not found')

    res.send(user)

  } catch (err: any) {
    next({ status: 500, message: "Failed to get user", details: err })
  }
}

