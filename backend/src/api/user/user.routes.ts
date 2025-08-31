import express, { Router } from 'express'
import { addUser, getUser } from './user.controller'
import { log } from '../../middlewares/log.middleware'
import { validatePhone } from './user.validations'

const router : Router = express.Router()

router.get('/:phone', validatePhone, getUser)
router.post('/', log, validatePhone, addUser)

export const userRoutes : Router = router