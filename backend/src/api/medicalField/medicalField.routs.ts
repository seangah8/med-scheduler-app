import express, { Router } from 'express'
import { getMedicalFields } from './medicalField.controller'
import { requireAuth } from '../user/user.validations'

const router : Router = express.Router()

router.get('/', requireAuth, getMedicalFields)

export const medicalFieldRoutes : Router = router