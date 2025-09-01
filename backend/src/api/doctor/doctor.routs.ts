import express, { Router } from 'express'
import { getDoctors, getSoonestAvailableDoctor } from './doctor.controller'
import { getSoonestAvailableDoctorSchema } from '../../models/schemas/doctor.schema'
import { validateRequest } from '../../middlewares/validate.middleware'
import { requireAuth } from '../../middlewares/auth.middleware'


const router : Router = express.Router()

router.get('/:medicalFieldId', requireAuth, getDoctors)
router.post('/soonest-available', requireAuth, validateRequest(getSoonestAvailableDoctorSchema), getSoonestAvailableDoctor)

export const doctorRoutes : Router = router