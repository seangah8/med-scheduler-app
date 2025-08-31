import { NextFunction, Request, Response } from 'express'
import { medicalFieldService } from "./medicalField.service"
import { logger } from '../../services/logger.service'

export async function getMedicalFields(_req: Request, res: Response, next: NextFunction) 
  : Promise<void>{

  try {
    const medicalFields = await medicalFieldService.query()
    res.send(medicalFields)
    
  } catch (err: any) {
    logger.error(err.message)
    next({ status: 400, message: "Failed to get medical fields", details: err })
  }
}