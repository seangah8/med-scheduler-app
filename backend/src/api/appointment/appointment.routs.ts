import express, { Router } from 'express'
import { addAppointment, getAllUnavailability, getAppointments } from './appointment.controller'
import { requireAuth } from '../user/user.validations'
import { validateBooking } from './appointment.validation'
import { log } from '../../middlewares/log.middleware'

const router : Router = express.Router()

router.get('/', requireAuth, getAppointments)
router.get('/unavailable-dates/:fieldId/:doctorId', requireAuth, getAllUnavailability)
router.post('/', log, requireAuth, validateBooking, addAppointment)

export const appointmentRoutes : Router = router