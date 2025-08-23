import { Request, Response } from 'express'
import { appointmentService } from './appointment.service'
import { logger } from '../../services/logger.service'
import { asyncLocalStorage } from '../../services/als.service'  

export async function getAppointment(req: Request, res: Response){
  const { id } = req.params
  try{
    const { appointment, doctor, medicalField } = 
      await appointmentService.get(id)
    res.send({ appointment, doctor, medicalField })

  } catch(err){
    logger.error(`Failed getting appointment: ${err}`)
    res.status(400).send(`Couldn't get appointment`)
  }
}

export async function getAppointments(req: Request, res: Response){

   const status = req.query.status as string

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

export async function cancelAppointment(req: Request, res: Response) {
  const { id } = req.params
  try{
    const canceledAppointment = await appointmentService.cancel(id)
    res.send(canceledAppointment)

  } catch(err){
    logger.error(`Failed cancel appointment: ${err}`)
    res.status(400).send(`Couldn't cancel appointment`)
  }
}

export async function rescheduleAppointment(req: Request, res: Response) {
  const { id, date } = req.params
  try{
    const newDate = new Date(date)
    const canceledAppointment = await appointmentService.reschedule(id, newDate)
    res.send(canceledAppointment)

  } catch(err){
    logger.error(`Failed cancel appointment: ${err}`)
    res.status(400).send(`Couldn't cancel appointment`)
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
