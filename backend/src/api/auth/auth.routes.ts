import express, { Router } from 'express'
import { log } from '../../middlewares/log.middleware'
import { sendOTP, verifyOTP, logout, getLoggedInUser } from './auth.controller'
import { requireAuth } from '../../middlewares/auth.middleware'
import { validateRequest } from '../../middlewares/validate.middleware'
import { sendOTPSchema, verifyOTPSchema } from '../../models/schemas/auth.schema'

const router : Router = express.Router()

router.get('/me', requireAuth, getLoggedInUser)
router.post('/send-otp', log, validateRequest(sendOTPSchema), sendOTP)
router.post('/verify-otp', log, validateRequest(verifyOTPSchema), verifyOTP)
router.post('/logout', requireAuth, logout)



export const authRoutes : Router = router