import express, { Router } from 'express'
import { addAppointment, 
    getAllUnavailability, 
    getAppointments, 
    getAppointment,
    cancelAppointment,
    rescheduleAppointment,
} from './appointment.controller'
import { requireAuth } from '../user/user.validations'
import { validateBooking } from './appointment.validation'
import { log } from '../../middlewares/log.middleware'

const router : Router = express.Router()

router.get('/', requireAuth, getAppointments)
router.get('/:id', requireAuth, getAppointment)
router.patch('/cancel/:id', requireAuth, cancelAppointment)
router.patch('/reschedule/:id/:date', requireAuth, rescheduleAppointment)
router.get('/unavailable-dates/:fieldId/:doctorId', requireAuth, getAllUnavailability)
router.post('/', log, requireAuth, validateBooking, addAppointment)

export const appointmentRoutes : Router = router