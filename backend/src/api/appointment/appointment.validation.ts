import { Request, Response , NextFunction} from 'express'
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
    // check if medical field exists
    console.log('medicalFieldId', medicalFieldId)
    const field = await medicalFieldService.getById(medicalFieldId)
    if (!field) throw new Error('Invalid medical field')

    // check if doctor exists
    const doctor = await doctorService.getById(doctorId)
    if (!doctor) throw new Error('Invalid doctor')

    // check if doctor work at that field
    const doctorWortAtField = doctor.schedule.fieldWorkdays.some(entry =>
      entry.medicalFieldId.toString() === medicalFieldId)
    if(!doctorWortAtField) throw new Error('Doctor does not support this medical field')

    // check if date make sense
    const bookingDate = new Date(date)
    const now = new Date()
    if (bookingDate <= now) throw new Error('Cannot book in the past')

    // check to not overlap booking
    const isExists = await appointmentService
      .isAppointmentExists(doctorId, date)
    if (isExists) throw new Error('Doctor already having appointment at this times')

    next()

  } catch (err) {
    logger.error(`Failed booking validation: ${err}`)
    return res.status(400).send('Booking validation failed')
  }
}
