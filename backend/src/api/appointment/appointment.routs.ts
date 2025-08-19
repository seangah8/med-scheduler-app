import express, { Router } from 'express'
import { getUnavailableDates } from './appointment.controller'
import { requireAuth } from '../user/user.validations'

const router : Router = express.Router()

router.get('/unavailable-dates/:doctorId/:fieldId', requireAuth, getUnavailableDates)

export const appointmentRoutes : Router = router