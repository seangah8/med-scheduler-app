import { Request, Response } from 'express'
import { doctorService } from "./doctor.service"
import { logger } from '../../services/logger.service'

export async function getDoctors(req: Request, res: Response) : Promise<void>{

  const { medicalFieldId } = req.params

  try {
    const doctors = await doctorService.query(medicalFieldId)
    res.send(doctors)
    
  } catch (err: any) {
    logger.error(err.message)
    res.status(400).send(`Couldn't get doctors`)
  }
}