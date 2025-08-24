import { ObjectId } from "mongodb"

export interface OtpTSModel {
  _id: ObjectId | string
  userId: ObjectId | string
  password: string
  expiresAt: Date
  isUserNew: boolean
}