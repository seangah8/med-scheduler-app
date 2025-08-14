import mongoose, { Document } from 'mongoose'
import { UserTSModel } from '../typescript/user.model'

// omit _id to avoid conflict with mongoose's document type
type UserMongoDocument = Omit<UserTSModel, '_id'> & Document

const userSchema = new mongoose.Schema<UserMongoDocument>({

  phone: {
    type: String,
    required: true,
    unique: true,
  },
  

}, {versionKey: false})  // disables __v

const UserMongoModel = mongoose.model('user', userSchema)
export { UserMongoModel }


