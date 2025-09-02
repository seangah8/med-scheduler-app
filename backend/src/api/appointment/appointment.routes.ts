import express, { Router } from 'express'
import { log } from '../../middlewares/log.middleware'
import { 
    addAppointment, 
    getAllUnavailability, 
    getAppointments, 
    getAppointment,
    cancelAppointment,
    rescheduleAppointment,
    changeAppointmentMethod,
    getAppointmentPdf,
} from './appointment.controller'
import { 
    getAppointmentSchema, 
    getAppointmentsSchema, 
    addAppointmentSchema, 
    cancelAppointmentSchema,
    rescheduleAppointmentSchema,
    changeAppointmentMethodSchema,
    getAllUnavailabilitySchema,
    getAppointmentPdfSchema,
} from '../../models/schemas/appointment.schema'
import { requireAuth } from '../../middlewares/auth.middleware'
import { validateBooking } from './appointment.validation'
import { validateRequest } from '../../middlewares/validate.middleware'

const router : Router = express.Router()

router.get('/', requireAuth, validateRequest(getAppointmentsSchema), getAppointments)
router.get('/:id', requireAuth, validateRequest(getAppointmentSchema), getAppointment)
router.get('/unavailable-dates/:fieldId/:doctorId', requireAuth, validateRequest(getAllUnavailabilitySchema), getAllUnavailability)
router.get('/pdf/:id', log, requireAuth, validateRequest(getAppointmentPdfSchema), getAppointmentPdf)
router.post('/', log, requireAuth, validateRequest(addAppointmentSchema), validateBooking, addAppointment)
router.patch('/cancel/:id', log, requireAuth, validateRequest(cancelAppointmentSchema), cancelAppointment)
router.patch('/reschedule/:id/:date', log, requireAuth, validateRequest(rescheduleAppointmentSchema), rescheduleAppointment)
router.patch('/virtual/:id/:isVirtual', log, requireAuth, validateRequest(changeAppointmentMethodSchema), changeAppointmentMethod)

export const appointmentRoutes : Router = router