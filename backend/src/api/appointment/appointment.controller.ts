import { NextFunction, Request, Response } from 'express'
import { appointmentService } from './appointment.service'
import { logger } from '../../services/logger.service'
import { asyncLocalStorage } from '../../services/als.service'  

export async function getAppointment(req: Request, res: Response, next: NextFunction){
  const { id } = req.params
  try{
    const { appointment, doctor, medicalField } = 
      await appointmentService.get(id)
    res.send({ appointment, doctor, medicalField })

  } catch(err){
    logger.error(`Failed getting appointment: ${err}`)
    next({ status: 400, message: "Failed to retrieve appointment", details: err })
  }
}

export async function getAppointments(req: Request, res: Response, next: NextFunction){

  const status = req.query.status as string

  const medicalFieldId = req.query.medicalFieldId as string | undefined
  const startDateStr = req.query.startDate as string | undefined
  const endDateStr = req.query.endDate as string | undefined

  const startDate = startDateStr ? new Date(startDateStr) : undefined
  const endDate = endDateStr ? new Date(endDateStr) : undefined

  const store = asyncLocalStorage.getStore()
  if (!store || !store?.loggedinUser) {
    next({ status: 401, message: "Unauthorized" })
    return
  }

  try{
    const {appointments, doctorMap, medicalFieldMap} = 
      await appointmentService.query(store.loggedinUser.userId, 
        status, medicalFieldId, startDate, endDate)
    res.send({appointments, doctorMap, medicalFieldMap})

  } catch(err){
    logger.error(`Failed getting appointments: ${err}`)
    next({ status: 400, message: "Failed to retrieve appointments", details: err })
  }
}



export async function addAppointment(req: Request<{}, {}, 
  {medicalFieldId: string, doctorId: string, date: Date, virtual:boolean}>, 
  res: Response , next: NextFunction): Promise<void> {

  const store = asyncLocalStorage.getStore()
  if (!store || !store?.loggedinUser) {
    next({ status: 401, message: "Unauthorized"})
    return
  }

  try {
    const { medicalFieldId, doctorId, date, virtual } = req.body
    const appointment = await appointmentService.add
      (medicalFieldId, doctorId, store.loggedinUser.userId, date, virtual)
    res.send(appointment)
  } catch (err: any) {
    logger.error(`Failed saving appointment: ${err.message}`)
    next({ status: 400, message: "Failed to save appointment", details: err })
  }
}

export async function cancelAppointment(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params
  try{
    const canceledAppointment = await appointmentService.cancel(id)
    res.send(canceledAppointment)

  } catch(err){
    logger.error(`Failed cancel appointment: ${err}`)
    next({ status: 400, message: "Failed to cancel appointment", details: err })
  }
}

export async function rescheduleAppointment(req: Request, res: Response, next: NextFunction) {
  const { id, date } = req.params
  try{
    const newDate = new Date(date)
    const rescheduledAppointment = await appointmentService.reschedule(id, newDate)
    res.send(rescheduledAppointment)

  } catch(err){
    logger.error(`Failed reschedule appointment: ${err}`)
    next({ status: 400, message: "Failed to reschedule appointment", details: err })
  }
}

export async function changeAppointmentMethod(req: Request, res: Response, next: NextFunction) {
  const { id, isVirtual } = req.params
  try{
    const updatedAppointment = 
      await appointmentService.changeMethod(id, isVirtual === "true")
    res.send(updatedAppointment)

  } catch(err){
    logger.error(`Failed change visit method appointment: ${err}`)
    next({ status: 400, message: "Failed to change visit method", details: err })
  }
}




export async function getAllUnavailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { fieldId, doctorId } = req.params

  try {
    const totalUnavailability = await 
      appointmentService.unavailableDates(fieldId, doctorId)
    res.send(totalUnavailability)

  } catch (err: any) {
    logger.error(`Error getting unavailable dates: ${err.message}`)
    next({ status: 400, message: "Failed to change visit method", details: err })
  }
}


export async function getAppointmentPdf(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params

  try {
    const buff = await appointmentService.streamAppointmentPdf(id)

    // telling the browser what kind of file it’s about to receive 
    // and how it should handle it.
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `inline; filename=appointment_${id}.pdf`
    )

    res.send(buff)

  } catch (err: any) {
    logger.error(`Failed to generate PDF: ${err}`)
    next({ status: 404, message: "Failed to generate PDF", details: err })
  }
}
