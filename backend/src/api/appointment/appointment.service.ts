import { AppointmentMongoModel } from "../../models/mongo/appointment.model"
import { logger } from "../../services/logger.service"

export const appointmentService = {
  unavailableDates,
}

export async function unavailableDates(doctorId: string, fieldId: string): Promise<Date[]> {
  try {
    const now = new Date()

    const appointments = await AppointmentMongoModel.find({
      doctorId,
      medicalFieldId: fieldId,
      startAt: { $gte: now },
      status: 'scheduled'
    }).select('startAt').lean()

    // extract just the startAt timestamps
    return appointments.map(app => app.startAt)
    
  } catch (err: any) {
    logger.error(`Failed to fetch unavailable dates for doctor 
      ${doctorId} and field ${fieldId}: ${err.message}`)
    throw err
  }
}

