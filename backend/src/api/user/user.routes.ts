import express, { Router } from 'express'
import { log } from '../../middlewares/log.middleware'
import { addUser, getUser, makeUserRegular } from './user.controller'
import { getUserSchema, addUserSchema, makeUserRegularSchema } from '../../models/schemas/user.schema'
import { validateRequest } from '../../middlewares/validate.middleware'
import { requireAuth } from '../../middlewares/auth.middleware'

const router : Router = express.Router()

router.get("/:phone", validateRequest(getUserSchema), getUser)
router.post('/', log, validateRequest(addUserSchema), addUser)
router.patch('/make-regular', log, requireAuth, validateRequest(makeUserRegularSchema), makeUserRegular)

export const userRoutes : Router = router