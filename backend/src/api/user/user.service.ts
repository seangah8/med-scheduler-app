import { logger } from "../../services/logger.service"
import { UserTSModel } from '../../models/typescript/user.model'
import { UserMongoModel } from '../../models/mongo/user.model'
import { CredentialsTSModel } from '../../models/typescript/credentials.model'

export const userService = {
  getByPhone,
  add,
}

async function getByPhone(phone: string): Promise<UserTSModel | null> {
  try {
    // .lean() removes mongoose document types
    const user = await UserMongoModel.findOne({ phone }).lean()
    if (!user) return null
    const finalUser: UserTSModel = { ...user, _id: user._id.toString() }
    return finalUser

  } catch (err) {
    logger.error({ err }, 'failed to get user by id')
    throw err
  }
}

async function add(credentials: CredentialsTSModel): Promise<UserTSModel> {
  try {
    const newUserDoc = await UserMongoModel.create(credentials)
    const finalUser: UserTSModel = 
      { ...newUserDoc.toObject(), _id: newUserDoc._id.toString() }
    logger.info(`user ${finalUser._id} added`)
    return finalUser

  } catch (err) {
    logger.error({ err }, 'Failed to create user');
    throw err;
  }
}



