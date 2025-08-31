import express, { Router } from 'express'
import { getDoctors, getSoonestAvailableDoctor } from './doctor.controller'
import { getSoonestAvailableDoctorSchema } from '../../models/schemas/doctor.schema'
import { validateRequest } from '../../middlewares/validate.middleware'
import { requireAuth } from '../../middlewares/auth.middleware'
import { log } from '../../middlewares/log.middleware'



const router : Router = express.Router()

router.get('/:medicalFieldId', log, requireAuth, getDoctors)
router.post('/soonest-available', log, requireAuth, validateRequest(getSoonestAvailableDoctorSchema), getSoonestAvailableDoctor)

export const doctorRoutes : Router = router