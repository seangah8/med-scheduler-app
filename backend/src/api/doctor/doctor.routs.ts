import express, { Router } from 'express'
import { getDoctors, getSoonestAvailableDoctor } from './doctor.controller'
import { requireAuth } from '../user/user.validations'
import { log } from '../../middlewares/log.middleware'



const router : Router = express.Router()

router.get('/:medicalFieldId', log, requireAuth, getDoctors)
router.post('/soonest-available', log, requireAuth, getSoonestAvailableDoctor)

export const doctorRoutes : Router = router