import { logger } from "../../services/logger.service"
import { UserTSModel } from '../../models/typescript/user.model'
import { UserMongoModel } from '../../models/mongo/user.model'
import { CredentialsTSModel } from '../../models/typescript/credentials.model'

export const userService = {
  getByPhone,
  getById,
  add,
  update,
}

async function getByPhone(phone: string): Promise<UserTSModel | null> {
  try {
    // .lean() removes mongoose document types
    const userDoc = await UserMongoModel.findOne({ phone }).lean()
    if (!userDoc) return null
    const user: UserTSModel = { ...userDoc, _id: userDoc._id.toString() }
    return user

  } catch (err : any) {
    logger.error(`Failed to get user by phone: ${err.message}`)
    throw err
  }
}

async function getById(id: string): Promise<UserTSModel | null> {
  try {
    // .lean() removes mongoose document types
    const userDoc = await UserMongoModel.findOne({ _id: id }).lean()
    if (!userDoc) return null
    const user: UserTSModel = { ...userDoc, _id: userDoc._id.toString() }
    return user

  } catch (err : any) {
    logger.error(`Failed to get user by id: ${err.message}`)
    throw err
  }
}

async function add(credentials: CredentialsTSModel): Promise<UserTSModel> {
  try {
    const now = new Date
    const newUserDoc = await UserMongoModel.create({...credentials, createdAt: now, isUserNew: true})
    const newUser: UserTSModel = 
      { ...newUserDoc.toObject(), _id: newUserDoc._id.toString() }
    logger.info(`User ${newUserDoc._id} added`)
    return newUser

  } catch (err : any) {
    logger.error(`Failed to create user: ${err.message}`)
    throw err
  }
}


async function update(userId: string, updates: Partial<UserTSModel>): Promise<UserTSModel | null> {
  try {
    const updatedUserDoc = await UserMongoModel.findByIdAndUpdate(
      userId, updates, { new: true })

    if (!updatedUserDoc)
      return null

    const updatedUser: UserTSModel = { ...updatedUserDoc.toObject(),
      _id: updatedUserDoc._id.toString()}

    logger.info(`User ${userId} updated`)
    return updatedUser
    
  } catch (err: any) {
    logger.error(`Failed to update user ${userId}: ${err.message}`)
    throw err
  }
}




