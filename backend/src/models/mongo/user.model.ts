import mongoose from "mongoose"
import { UserTSModel } from "../typescript/user.model"

// omit _id to avoid conflict with mongoose's document type
type UserDocument = Omit<UserTSModel, '_id'> & Document

const userSchema = new mongoose.Schema<UserDocument>({

  phone: {
    type: String,
    required: true,
    unique: true,
  },

  createdAt:{
    type: Date,
    required: true
  },

  isUserNew: {
    type: Boolean,
    required: true
  }
  

}, {versionKey: false})  // disables __v

const UserMongoModel = mongoose.model<UserDocument>('user', userSchema)
export { UserMongoModel }


