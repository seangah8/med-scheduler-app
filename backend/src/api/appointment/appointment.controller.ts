import { Request, Response } from 'express'
import { appointmentService } from './appointment.service'
import { logger } from '../../services/logger.service'

export async function getUnavailableDates(req: Request, res: Response) : Promise<void>{
  
  const { doctorId, fieldId } = req.params

  try {
    const unavailableDates = 
      await appointmentService.unavailableDates(doctorId, fieldId)
    res.send(unavailableDates)
    
  } catch (err: any) {
    logger.error(err.message)
    res.status(400).send(`Couldn't get unavailable dates`)
  }
}