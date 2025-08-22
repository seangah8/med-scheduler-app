import { Request, Response } from 'express'
import { appointmentService } from './appointment.service'
import { logger } from '../../services/logger.service'
import { asyncLocalStorage } from '../../services/als.service'  


export async function getAppointments(req: Request, res: Response){

  const { status } = req.params

  const store = asyncLocalStorage.getStore()
  if (!store || !store?.loggedinUser) {
    res.status(401).send('Unauthorized')
    return
  }

  try{
    const {appointments, doctorMap, medicalFieldMap} = 
      await appointmentService.query(store.loggedinUser.userId, status)
    res.send({appointments, doctorMap, medicalFieldMap})

  } catch(err){
    logger.error(`Failed getting appointments: ${err}`)
    res.status(400).send(`Couldn't get appointments`)
  }
}



export async function addAppointment(req: Request<{}, {}, 
  {medicalFieldId: string, doctorId: string, date: Date}>, res: Response): Promise<void> {

  const store = asyncLocalStorage.getStore()
  if (!store || !store?.loggedinUser) {
    res.status(401).send('Unauthorized')
    return
  }

  try {
    const { medicalFieldId, doctorId, date } = req.body
    const appointment = await appointmentService.add
      (medicalFieldId, doctorId, store.loggedinUser.userId, date)
    res.send(appointment)
  } catch (err: any) {
    logger.error(`Failed saving appointment: ${err.message}`)
    res.status(400).send(`Couldn't save appointment`)
  }
}


export async function getAllUnavailability(req: Request, res: Response): Promise<void> {
  const { fieldId, doctorId } = req.params

  try {
    const totalUnavailability = await 
      appointmentService.unavailableDates(fieldId, doctorId)
    res.send(totalUnavailability)

  } catch (err: any) {
    logger.error(`Error getting unavailable dates: ${err.message}`)
    res.status(400).send(`Couldn't get unavailable dates`)
  }
}
