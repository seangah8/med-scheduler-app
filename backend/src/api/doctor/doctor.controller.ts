import { NextFunction, Request, Response } from 'express'
import { doctorService } from "./doctor.service"
import { logger } from '../../services/logger.service'

export async function getDoctors(req: Request, res: Response, next: NextFunction) : Promise<void>{

  const { medicalFieldId } = req.params

  try {
    const doctors = await doctorService.query(medicalFieldId)
    res.send(doctors)
    
  } catch (err: any) {
    logger.error(err.message)
    next({ status: 400, message: "Failed to get doctors", details: err })
  }
}


export async function getSoonestAvailableDoctor(
  req: Request<{}, {}, { doctorsId: string[]; fieldId: string }>,
  res: Response, next: NextFunction
) {

  try {
    const { doctorsId, fieldId } = req.body

    const soonestDoctorId = await doctorService.getSoonestId(doctorsId, fieldId)

    if (doctorsId.length > 0 && !soonestDoctorId) 
      return next({ status: 404, message: "No available doctor found"})
    
    res.send(soonestDoctorId)

  } catch (err: any) {
    logger.error(`Error finding soonest available doctor: ${err.message}`)
    next({ status: 500, message: "Server error while finding soonest available doctor", 
      details: err })
  }
}


