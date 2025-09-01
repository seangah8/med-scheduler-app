import { DoctorTSModel } from "../../models/typescript/doctor.model"
import { DoctorMongoModel } from "../../models/mongo/doctor.model"
import { logger } from "../../services/logger.service"
import { format } from "date-fns"
import { appointmentService } from "../appointment/appointment.service"


export const doctorService = {
  query,
  getById,
  getSoonestId
}

async function query(medicalFieldId: string): Promise<DoctorTSModel[]> {
  try {
    // using index from schema to serach faster
    const doctorsDoc = await DoctorMongoModel.find({
      'schedule.fieldWorkdays.medicalFieldId': medicalFieldId}).lean()
    const doctors: DoctorTSModel[] = doctorsDoc.map(doc => ({
      ...doc, _id: doc._id.toString()}))
    return doctors
    
  } catch (err: any) {
    logger.error(`Failed to get doctors for medicalFieldId ${medicalFieldId}: ${err.message}`)
    throw err
  }
}

async function getById(id: string): Promise<DoctorTSModel | null> {
  try {
    const doctorDoc = await DoctorMongoModel.findOne({ _id: id }).lean()
    if (!doctorDoc) return null
    const doctor: DoctorTSModel = { ...doctorDoc, _id: doctorDoc._id.toString() }
    return doctor

  } catch (err : any) {
    logger.error(`Failed to get doctor by id: ${err.message}`)
    throw err
  }
}


async function getSoonestId(
  doctorsId: string[],
  fieldId: string
): Promise<string | null> {

  const doctors = await DoctorMongoModel.find({
    _id: { $in: doctorsId }
  }).lean()

  // use Promise.all to run all doctor availability checks in parallel, 
  // reducing total time from several seconds to 100–200ms
  const results = await Promise.all(
    doctors.map(async doc => {
      const doctor: DoctorTSModel = { ...(doc as any), _id: doc._id.toString() }
      const availableDay = await _findSoonestAvailableDay(doctor, fieldId)
      return { doctorId: doctor._id as string, availableDay }
    })
  )

  const valid = results.filter(r => r.availableDay)
  if (!valid.length) return null

  console.log('valid', valid)

  const soonest = valid.reduce((a, b) =>
    a.availableDay! < b.availableDay! ? a : b
  )

  console.log('soonest', soonest)

  return soonest.doctorId
}



async function _findSoonestAvailableDay(
  doctor: DoctorTSModel,
  fieldId: string,
  maxDays: number = 365
): Promise<Date | null> {

  const { unavailableDays } = await appointmentService.unavailableDates(
    fieldId, doctor._id.toString())

  const unavailableDaysSet = new Set(unavailableDays)

  const today = new Date()

  for (let i = 0; i < maxDays; i++) {
    const day = new Date(today)
    day.setDate(today.getDate() + i)

    if (!_isDayDisable(day, fieldId, doctor, unavailableDaysSet)) 
      return day
  }

  // if there is no availble date within maxDays
  return null
}


function _isDayDisable(
  date: Date,
  fieldId: string,
  doctor: DoctorTSModel,
  unavailableDaysSet: Set<string>
): boolean {

  const todayStr = format(new Date(), "yyyy-MM-dd")
  const targetStr = format(date, "yyyy-MM-dd")

  const dayOfWeek = date.getDay() // 0 = Sunday

  // is before today
  const isPast = targetStr < todayStr

  // is friday or saturday
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6

  // is not in doctor's field workdays
  const fieldSchedule = doctor.schedule.fieldWorkdays.find(
    f => f.medicalFieldId.toString() === fieldId.toString()
  )

  const isNotAvailableForFieldToday =
    !fieldSchedule || !fieldSchedule.days.includes(dayOfWeek)

  // is fully booked day
  const isInUnavailableDays = unavailableDaysSet.has(targetStr)



  return (
    isPast || isWeekend || isNotAvailableForFieldToday || isInUnavailableDays
  )
}
