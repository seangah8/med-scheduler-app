import { NextFunction, Request, Response } from 'express'
import { logger } from '../../services/logger.service'
import { userService } from './user.service'
import { CredentialsTSModel } from '../../models/typescript/credentials.model'

// when user login with a phone number 
// we want to check if the user exists and return it
export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { phone } = req.params
  try {
    const user = await userService.getByPhone(phone)
    if(!user) throw new Error('user not found!')
    res.send(user)

  } catch (err: any) {
    logger.error(`Failed gettin user: ${err.message}`)
    next({ status: 400, message: "Failed to get user", details: err })
  }
}

// when sign up with phone number 
// we want to create the new user in db
export async function addUser(req: Request<{}, {}, CredentialsTSModel>, 
  res: Response, next: NextFunction
  ): Promise<void> {

  try {
    const credentials = req.body
    const user = await userService.add(credentials)
    res.send(user)
    
  } catch (err: any) {
    logger.error(`Failed saving user: ${err.message}`)
    next({ status: 400, message: "Failed to save user", details: err })
  }
}


export async function makeUserRegular(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.body

    const updatedUser = await userService.update(userId, { isUserNew: false })

    if (!updatedUser) 
      return next({ status: 404, message: "User not found"})

    res.send(updatedUser)
  } catch (err: any) {
    logger.error(`Failed to update user ${req.body?.userId} to regular: ${err.message}`)
    next({ status: 500, message: "Failed to update user", details: err })
  }
}
