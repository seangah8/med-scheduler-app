import express, { Router } from 'express'
import { getDoctors } from './doctor.controller'
import { requireAuth } from '../user/user.validations'

const router : Router = express.Router()

router.get('/:medicalFieldId', requireAuth, getDoctors)

export const doctorRoutes : Router = router