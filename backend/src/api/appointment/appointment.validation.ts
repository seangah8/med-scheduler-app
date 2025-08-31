import { Request, Response , NextFunction} from 'express'
import mongoose from 'mongoose'
import { medicalFieldService } from '../medicalField/medicalField.service'
import { doctorService } from '../doctor/doctor.service'
import { appointmentService } from './appointment.service'
import { logger } from '../../services/logger.service'

export async function validateBooking(
  req: Request<{}, {}, { medicalFieldId: string, doctorId: string, date: Date }>,
  res: Response,
  next: NextFunction
) {
  const { medicalFieldId, doctorId, date } = req.body

  try {

    // validate required fields
    if (!medicalFieldId || !doctorId || !date) 
      return res.status(400).json({ error: 'Missing required fields' })

    // validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(medicalFieldId)) 
      return res.status(400).json({ error: 'Invalid medical field ID' })
    if (!mongoose.Types.ObjectId.isValid(doctorId)) 
      return res.status(400).json({ error: 'Invalid doctor ID' })
    
    // validate date
    const bookingDate = new Date(date)
    if (isNaN(bookingDate.getTime())) 
      return res.status(400).json({ error: 'Invalid date format' })
    
    // validate medical field existence
    const field = await medicalFieldService.getById(medicalFieldId)
    if (!field) return res.status(400).json({ error: 'Invalid medical field' })

    // validate doctor existence
    const doctor = await doctorService.getById(doctorId)
    if (!doctor) return res.status(400).json({ error: 'Invalid doctor' })

    // validate if doctor work at that field
    const doctorWorksAtField = doctor.schedule.fieldWorkdays.some(entry =>
      entry.medicalFieldId.toString() === medicalFieldId)
    if(!doctorWorksAtField) 
      return res.status(400).json({ error: 'Doctor does not support this medical field' })

    // validate date
    const now = new Date()
    if (bookingDate <= now) 
      return res.status(400).json({ error: 'Cannot book in the past' })

    // validate non-overlapping booking
    const isExists = await appointmentService.isAppointmentExists(doctorId, date)
    if (isExists) 
      return res.status(400).json({ error: 'Doctor already has an appointment at this time' })
    
    next()

  } catch (err) {
    logger.error(`Failed booking validation: ${err}`)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
