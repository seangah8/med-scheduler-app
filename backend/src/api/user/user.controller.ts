import { Request, Response } from 'express'
import { logger } from '../../services/logger.service'
import { userService } from './user.service'
import { CredentialsTSModel } from '../../models/typescript/credentials.model'

// when user login with a phone number 
// we want to check if the user exists and return it
export async function getUser(req: Request, res: Response): Promise<void> {
  const { phone } = req.params
  try {
    const user = await userService.getByPhone(phone)
    if(!user) throw new Error('user not found!')
    res.send(user)

  } catch (err: any) {
    logger.error(`Failed gettin user: ${err.message}`)
    res.status(400).json({ error: "Failed to get user", details: err })
  }
}

// when sign up with phone number 
// we want to create the new user in db
export async function addUser(req: Request<{}, {}, CredentialsTSModel>, res: Response): Promise<void> {
  try {
    const credentials = req.body
    const user = await userService.add(credentials)
    res.send(user)
  } catch (err: any) {
    logger.error(`Failed saving user: ${err.message}`)
    res.status(400).json({ error: "Failed to save user", details: err })
  }
}
