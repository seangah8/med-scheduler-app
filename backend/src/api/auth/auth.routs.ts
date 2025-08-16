import express, { Router } from 'express'
import { log } from '../../middlewares/log.middleware'
import { sendOTP, verifyOTP } from './auth.controller'

const router : Router = express.Router()

router.post('/send-otp', log, sendOTP)
router.post('/verify-otp', log, verifyOTP)

export const authRoutes : Router = router