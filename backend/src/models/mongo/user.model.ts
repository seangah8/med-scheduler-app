import mongoose from "mongoose"


const userSchema = new mongoose.Schema({

  phone: {
    type: String,
    required: true,
    unique: true,
  },
  

}, {versionKey: false})  // disables __v

const UserMongoModel = mongoose.model('user', userSchema)
export { UserMongoModel }


