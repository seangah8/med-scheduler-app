import { Request, Response } from 'express'
import { medicalFieldService } from "./medicalField.service"
import { logger } from '../../services/logger.service'

export async function getMedicalFields(req: Request, res: Response) : Promise<void>{
  try {
    const medicalFields = await medicalFieldService.query()
    res.send(medicalFields)
  } catch (err: any) {
    logger.error(err.message)
    res.status(400).send(`Couldn't get medical fields`)
  }
}