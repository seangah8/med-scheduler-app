import express, { Router } from 'express'
import { addAppointment, 
    getAllUnavailability, 
    getAppointments, 
    getAppointment,
    cancelAppointment,
    rescheduleAppointment,
    changeAppointmentMethod,
    getAppointmentPdf,
} from './appointment.controller'
import { requireAuth } from '../user/user.validations'
import { validateBooking } from './appointment.validation'
import { log } from '../../middlewares/log.middleware'

const router : Router = express.Router()

router.get('/', log, requireAuth, getAppointments)
router.get('/:id', log, requireAuth, getAppointment)
router.get('/unavailable-dates/:fieldId/:doctorId', log, requireAuth, getAllUnavailability)
router.get('/pdf/:id', log, requireAuth, getAppointmentPdf)
router.post('/', log, requireAuth, validateBooking, addAppointment)
router.patch('/cancel/:id', log, requireAuth, cancelAppointment)
router.patch('/reschedule/:id/:date', log, requireAuth, rescheduleAppointment)
router.patch('/virtual/:id/:isVirtual', log, requireAuth, changeAppointmentMethod)

export const appointmentRoutes : Router = router