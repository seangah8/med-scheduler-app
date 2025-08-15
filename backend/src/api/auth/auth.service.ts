import mongoose from 'mongoose'
import { OtpMongoModel } from '../../models/mongo/otp.model'
import { logger } from '../../services/logger.service'

export const authService = {
  setOTP,
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

