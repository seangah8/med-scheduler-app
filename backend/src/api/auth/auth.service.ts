import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { OtpMongoModel } from '../../models/mongo/otp.model'
import { logger } from '../../services/logger.service'
import { ENV } from '../../config/env'
import { LoginTokenModel } from '../../models/typescript/alsStore.model'


export const authService = {
  setOTP,
  checkOTP,
  validateToken,
}

export async function setOTP(userId: string): Promise<string> {

  // remove any existing otps for this user
  await OtpMongoModel.deleteMany({ userId })
  // generate 6-digit otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString() 
  // expires 5 minutes
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) 
  

  // create new otp document
  await OtpMongoModel.create({
    userId: new mongoose.Types.ObjectId(userId),
    password: otp,
    expiresAt
  })

  logger.info(`mock otp for user ${userId}: ${otp}`)
  return otp
}


export async function checkOTP(userId: string, password: string): Promise<void> {

  const otpDoc = await OtpMongoModel.findOne({
      userId,
      password,
      expiresAt: { $gt: new Date() }
    })

    if (!otpDoc) 
      throw new Error('Invalid or expired OTP')

    // remove the otp from db
    await OtpMongoModel.deleteOne({ _id: otpDoc._id })

    logger.info(`OTP confirmed valid for user ${userId}`)
}

export function validateToken(token: string): LoginTokenModel | null {
  try {
    const { userId } = jwt.verify(token, ENV.JWT_SECRET) as { userId: string }
    return { userId }
  } catch (err: any) {
    logger.error(`Invalid JWT token: ${err.message}`)
    return null
  }
}

