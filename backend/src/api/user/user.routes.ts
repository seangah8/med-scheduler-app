import express, { Router } from 'express'
import { log } from '../../middlewares/log.middleware'
import { addUser, getUser } from './user.controller'
import { getUserSchema, addUserSchema } from '../../models/schemas/user.schema'
import { validateRequest } from '../../middlewares/validate.middleware'

const router : Router = express.Router()

router.get("/:phone", validateRequest(getUserSchema), getUser)
router.post('/', log, validateRequest(addUserSchema), addUser)

export const userRoutes : Router = router