import { ObjectId } from "mongodb"
import { AppointmentMongoModel } from "../../models/mongo/appointment.model"
import { DoctorMongoModel } from "../../models/mongo/doctor.model"
import { AppointmentTSModel } from "../../models/typescript/appointment.model"
import { DoctorTSModel } from "../../models/typescript/doctor.model"
import { logger } from "../../services/logger.service"

export const appointmentService = {
  quary,
  add,
  unavailableDates,
  isAppointmentExists,
}

async function quary(userId : string) : Promise<AppointmentTSModel[]> {
  try{
    const appointmentsDoc = await AppointmentMongoModel.find({userId})
      .sort({ startAt: 1 })
      .lean()
    const appointments: AppointmentTSModel[] = 
      appointmentsDoc.map(app=>({...app, _id: app._id.toString()}))
    return appointments

  } catch(err){
    logger.error(`Failed to get appointment: ${err}`)
    throw err
  }
}



async function add(
  fieldId: string,
  doctorId: string,
  userId: string,
  date: Date
): Promise<AppointmentTSModel> {

  try{
    const appointmentDoc = await AppointmentMongoModel.create({
      userId: new ObjectId(userId),
      doctorId: new ObjectId(doctorId),
      medicalFieldId: new ObjectId(fieldId),
      startAt: date,
      status: 'scheduled',
    })
    const appointment : AppointmentTSModel = {
      _id: appointmentDoc._id,
      userId: appointmentDoc.userId,
      doctorId: appointmentDoc.doctorId,
      medicalFieldId: appointmentDoc.medicalFieldId,
      startAt: appointmentDoc.startAt,
      status: appointmentDoc.status,
    }
    return appointment

  } catch(err){
      logger.error(`Failed to add appointment: ${err}`)
      throw err
  }


}

async function unavailableDates( fieldId: string, doctorId: string
  ): Promise<{unavailableDays: string[], unavailableSlots: string[]}> {

  try {
    const now = new Date()

    // fetch relevant doctor (to get their schedule)
    const doctorDoc = await DoctorMongoModel.findById(doctorId).lean()
    if (!doctorDoc) throw new Error("Doctor not found")

    const doctor: DoctorTSModel = {
      ...doctorDoc, _id: doctorDoc._id.toString()}

    // calculate max daily slots
    const maxSlotsPerDay = _maxDailySlots(doctor)

    // fetch all future appointments for this doctor + field
    const appointments = await AppointmentMongoModel.find({
      doctorId,
      medicalFieldId: fieldId,
      startAt: { $gte: now },
      status: "scheduled"
    }).select("startAt").lean()

    // group appointments by date (YYYY-MM-DD)
    const dayMap = new Map<string, string[]>()

    for (const app of appointments) {
      const iso = new Date(app.startAt).toISOString()
      const dateOnly = iso.split("T")[0]

      if (!dayMap.has(dateOnly)) {
        dayMap.set(dateOnly, [])
      }
      dayMap.get(dateOnly)!.push(iso)
    }

    // split into fully-booked days and partially booked slots
    const unavailableDays: string[] = []
    const unavailableSlots: string[] = []

    for (const [date, slots] of dayMap.entries()) {
      if (slots.length >= maxSlotsPerDay) {
        unavailableDays.push(date)
      } else {
        unavailableSlots.push(...slots)
      }
    }

    return { unavailableDays, unavailableSlots }

  } catch (err: any) {
    logger.error(`Failed to fetch unavailable dates for 
      doctor ${doctorId} and field ${fieldId}: ${err.message}`)
    throw err
  }
}

export async function isAppointmentExists(
  doctorId: string,
  date: Date
): Promise<boolean> {
  
  try {
    const existing = await AppointmentMongoModel.findOne({
      doctorId,
      startAt: date,
      status: 'scheduled'
    })
    return !!existing

  } catch (err) {
    console.error("Failed to check appointment existence:", err)
    throw err
  }
}



function _maxDailySlots( doctor: DoctorTSModel ) : number {

    // find slot duration
    const interval = doctor.schedule.intervalMinutes

    // parse working hours
    const [startHour, startMin] = doctor.schedule.start.split(":").map(Number)
    const [endHour, endMin] = doctor.schedule.end.split(":").map(Number)
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)

    // subtract break durations
    let breakMinutes = 0

    for (const br of doctor.schedule.breaks || []) {
      const [brStartH, brStartM] = br.start.split(":").map(Number)
      const [brEndH, brEndM] = br.end.split(":").map(Number)

      const brStart = brStartH * 60 + brStartM
      const brEnd = brEndH * 60 + brEndM

      breakMinutes += brEnd - brStart
    }

    const effectiveMinutes = totalMinutes - breakMinutes
    return Math.floor(effectiveMinutes / interval)
}
