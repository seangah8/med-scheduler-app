import express, { Router } from 'express'
import { log } from '../../middlewares/log.middleware'
import { sendOTP } from './auth.controller'

const router : Router = express.Router()

router.post('/send-otp', log, sendOTP)

export const authRoutes : Router = router