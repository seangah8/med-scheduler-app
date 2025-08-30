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


export async function getSoonestAvailableDoctor(
  req: Request<{}, {}, { doctorsId: string[]; fieldId: string }>,
  res: Response
) {

  try {
    const { doctorsId, fieldId } = req.body

    if (!doctorsId?.length || !fieldId) 
      return res.status(400).send("Missing doctorsId or fieldId")

    const soonestDoctorId = await doctorService.getSoonestId(doctorsId, fieldId)

    if (!soonestDoctorId) 
      return res.status(404).send("No available doctor found")
    
    res.send(soonestDoctorId)

  } catch (err: any) {
    logger.error(`Error finding soonest available doctor: ${err.message}`)
    res.status(500).send("Server error while finding soonest available doctor")
  }
}


