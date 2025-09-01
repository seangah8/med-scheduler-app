import { Request, Response , NextFunction} from 'express'
import mongoose from 'mongoose'
import { medicalFieldService } from '../medicalField/medicalField.service'
import { doctorService } from '../doctor/doctor.service'
import { appointmentService } from './appointment.service'
import { logger } from '../../services/logger.service'

export async function validateBooking(
  req: Request<{}, {}, { medicalFieldId: string, doctorId: string, date: Date }>,
  _res: Response,
  next: NextFunction
) {
  const { medicalFieldId, doctorId, date } = req.body

  try {

    // validate required fields
    if (!medicalFieldId || !doctorId || !date) 
      return next({ status: 400, message: "Missing required fields"})

    // validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(medicalFieldId)) 
      return next({ status: 400, message: "Invalid medical field ID"})
    if (!mongoose.Types.ObjectId.isValid(doctorId)) 
      return next({ status: 400, message: "Invalid doctor ID"})
    
    // validate date
    const bookingDate = new Date(date)
    if (isNaN(bookingDate.getTime())) 
      return next({ status: 400, message: "Invalid date format"})
    
    // validate medical field existence
    const field = await medicalFieldService.getById(medicalFieldId)
    if (!field) return next({ status: 400, message: "Invalid medical field"})

    // validate doctor existence
    const doctor = await doctorService.getById(doctorId)
    if (!doctor) return next({ status: 400, message: "Invalid doctor"})

    // validate if doctor work at that field
    const doctorWorksAtField = doctor.schedule.fieldWorkdays.some(entry =>
      entry.medicalFieldId.toString() === medicalFieldId)
    if(!doctorWorksAtField) 
      return next({ status: 400, message: "Doctor does not support this medical field"})

    // validate date
    const now = new Date()
    if (bookingDate <= now) 
      return next({ status: 400, message: "Cannot book in the past"})

    // validate non-overlapping booking
    const isExists = await appointmentService.isAppointmentExists(doctorId, date)
    if (isExists) 
      return next({ status: 400, message: "Doctor already has an appointment at this time" })
    
    next()

  } catch (err) {
    logger.error(`Failed booking validation: ${err}`)
    return next({ status: 500, message: "Internal server error", details: err })
  }
}
