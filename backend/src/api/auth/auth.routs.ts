import express, { Router } from 'express'
import { log } from '../../middlewares/log.middleware'
import { sendOTP, verifyOTP, logout, getLoggedInUser } from './auth.controller'
import { requireAuth, validatePhone } from '../user/user.validations'

const router : Router = express.Router()

router.get('/me', requireAuth, getLoggedInUser)
router.post('/send-otp', log, validatePhone, sendOTP)
router.post('/verify-otp', log, verifyOTP)
router.post('/logout', requireAuth, logout)



export const authRoutes : Router = router