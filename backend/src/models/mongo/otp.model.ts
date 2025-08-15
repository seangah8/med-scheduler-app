import mongoose, { Schema, Document } from 'mongoose'
import { OtpTSModel } from '../typescript/otp.model'

// omit _id to avoid conflict with mongoose's document type
type OtpDocument = Omit<OtpTSModel, '_id'> & Document

const otpSchema = new Schema<OtpDocument>({

  userId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'user' 
  },

  password: { 
    type: String, 
    required: true 
  },

  expiresAt: { 
    type: Date, 
    required: true 
  },

}, {versionKey: false})  // disables __v

// index to auto-delete after expiresAt
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const OtpMongoModel = mongoose.model<OtpDocument>('otp', otpSchema)
