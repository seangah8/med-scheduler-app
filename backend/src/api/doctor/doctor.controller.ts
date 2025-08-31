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
    res.status(400).json({ error: "Failed to get doctors", details: err })
  }
}


export async function getSoonestAvailableDoctor(
  req: Request<{}, {}, { doctorsId: string[]; fieldId: string }>,
  res: Response
) {

  try {
    const { doctorsId, fieldId } = req.body

    if (!doctorsId?.length || !fieldId) 
      return res.status(400).json({ error: "Missing doctorsId or fieldId"})


    const soonestDoctorId = await doctorService.getSoonestId(doctorsId, fieldId)

    if (!soonestDoctorId) 
      return res.status(404).json({ error: "No available doctor found"})
    
    res.send(soonestDoctorId)

  } catch (err: any) {
    logger.error(`Error finding soonest available doctor: ${err.message}`)
    res.status(500).json({ error: "Server error while finding soonest available doctor", 
      details: err })
  }
}


