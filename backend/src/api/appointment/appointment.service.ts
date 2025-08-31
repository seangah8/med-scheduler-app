import PDFDocument from "pdfkit"
import { ObjectId } from "mongodb"
import { AppointmentMongoModel } from "../../models/mongo/appointment.model"
import { DoctorMongoModel } from "../../models/mongo/doctor.model"
import { AppointmentTSModel, PopulatedAppointment, NamePopulatedAppointment } from "../../models/typescript/appointment.model"
import { DoctorTSModel } from "../../models/typescript/doctor.model"
import { logger } from "../../services/logger.service"
import { MedicalFieldTSModel } from "../../models/typescript/medicalField.model"
import { UserMongoModel } from "../../models/mongo/user.model"
import { MedicalFieldMongoModel } from "../../models/mongo/medicalField.model"

export const appointmentService = {
  query,
  get,
  add,
  cancel,
  reschedule,
  changeMethod,
  unavailableDates,
  isAppointmentExists,
  streamAppointmentPdf,
}

async function query(
  userId: string, 
  status: string, 
  medicalFieldId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<{

  appointments: AppointmentTSModel[]
  doctorMap: Record<string, string>
  medicalFieldMap: Record<string, string>
}> {

  try {

    const filter: any = { userId, status }
    
    if (medicalFieldId) 
      filter.medicalFieldId = medicalFieldId

    if (startDate || endDate) {
      filter.startAt = {}
      if (startDate) filter.startAt.$gte = startDate
      if (endDate) filter.startAt.$lte = endDate
    }

    const sortOrder = status === 'scheduled' ? 1 : -1

    const appointmentsDoc = await AppointmentMongoModel.find(filter)
      .sort({ startAt: sortOrder })
      .populate('doctorId', 'name')
      .populate('medicalFieldId', 'name')
      .lean<NamePopulatedAppointment[]>()

    // convert all _ids to strings
    const appointments: AppointmentTSModel[] = appointmentsDoc.map(app => ({
      ...app,
      _id: app._id.toString(),
      userId: app.userId.toString(),
      doctorId: app.doctorId._id.toString(),
      medicalFieldId: app.medicalFieldId._id.toString(),
    }))

    // build doctor name map
    const doctorMap: Record<string, string> = {}
    appointmentsDoc.forEach(app => {
      doctorMap[app.doctorId._id.toString()] = app.doctorId.name})

    // Build medical field name map
    const medicalFieldMap: Record<string, string> = {}
    appointmentsDoc.forEach(app => 
      {medicalFieldMap[app.medicalFieldId._id.toString()] 
        = app.medicalFieldId.name})

    return { appointments, doctorMap, medicalFieldMap }

  } catch (err) {
    logger.error(`Failed to get appointments: ${err}`)
    throw err
  }
}



async function get(id: string): Promise<{
  appointment: AppointmentTSModel
  doctor: DoctorTSModel
  medicalField: MedicalFieldTSModel
}> {
  try {
    const app = await AppointmentMongoModel.findById(id)
      .populate('doctorId')
      .populate('medicalFieldId')
      .lean<PopulatedAppointment>()

    if (!app) throw new Error(`Appointment with id ${id} not found`)

    // convert appointment _ids into strings
    const appointment: AppointmentTSModel = {
      ...app,
      _id: app._id.toString(),
      userId: app.userId.toString(),
      doctorId: app.doctorId._id.toString(),
      medicalFieldId: app.medicalFieldId._id.toString()
    }

    // return the entire populated objects
    const doctor = app.doctorId
    const medicalField = app.medicalFieldId

    return { appointment, doctor, medicalField }

  } catch (err) {
    logger.error(`Failed to get appointment ${id}: ${err}`)
    throw err
  }
}





async function add(
  fieldId: string,
  doctorId: string,
  userId: string,
  date: Date,
  virtual: boolean
): Promise<AppointmentTSModel> {

  try{
    const now = new Date
    const appointmentDoc = await AppointmentMongoModel.create({
      userId: new ObjectId(userId),
      doctorId: new ObjectId(doctorId),
      medicalFieldId: new ObjectId(fieldId),
      startAt: date,
      status: 'scheduled',
      createdAt: now,
      virtual
    })

    const appointment = 
      appointmentDoc.toObject() as AppointmentTSModel


    return appointment

  } catch(err){
      logger.error(`Failed to add appointment: ${err}`)
      throw err
  }
}

async function cancel(id: string): Promise<AppointmentTSModel> {
  try {
    // new: true => return the updated document, not the original one
    const updated = await AppointmentMongoModel.findByIdAndUpdate
      (id, { $set: { status: 'cancelled' } }, { new: true })
      .lean()
    

    if (!updated) {
      throw new Error('Appointment not found')
    }

    const appointment : AppointmentTSModel ={
      ...updated,
      _id: updated._id.toString(),
      userId: updated.userId.toString(),
      doctorId: updated.doctorId.toString(),
      medicalFieldId: updated.medicalFieldId.toString(),
    }

    return appointment

  } catch (err) {
    logger.error(`Failed to cancel appointment: ${err}`)
    throw err
  }
}

async function reschedule(id: string, date: Date): Promise<AppointmentTSModel> {
  try {
    const updated = await AppointmentMongoModel.findByIdAndUpdate
      (id, { $set: { startAt: date } }, { new: true })
      .lean()

    if (!updated) {
      throw new Error('Appointment not found')
    }

    const appointment : AppointmentTSModel ={
      ...updated,
      _id: updated._id.toString(),
      userId: updated.userId.toString(),
      doctorId: updated.doctorId.toString(),
      medicalFieldId: updated.medicalFieldId.toString(),
    }

    return appointment

  } catch (err) {
    logger.error(`Failed to reschedule appointment: ${err}`)
    throw err
  }
}

async function changeMethod(id: string, isVirtual: boolean): Promise<AppointmentTSModel> {
  try {
    const updated = await AppointmentMongoModel.findByIdAndUpdate
      (id, { $set: { virtual: isVirtual } }, { new: true })
      .lean()

    if (!updated) {
      throw new Error('Appointment not found')
    }

    const appointment : AppointmentTSModel ={
      ...updated,
      _id: updated._id.toString(),
      userId: updated.userId.toString(),
      doctorId: updated.doctorId.toString(),
      medicalFieldId: updated.medicalFieldId.toString(),
    }

    return appointment

  } catch (err) {
    logger.error(`Failed to change appointment visit method: ${err}`)
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

async function isAppointmentExists(
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
    logger.error(`Failed to check appointment existence: ${err}`)
    throw err
  }
}


async function streamAppointmentPdf(id: string): Promise<Buffer> {

  const appointment = await AppointmentMongoModel.findById(id).lean()
  if (!appointment) throw new Error("Appointment not found")

  if (appointment.status !== "completed")
    throw new Error("PDF only available for completed appointments")

  const user = await UserMongoModel.findById(appointment.userId).lean()
  if (!user) throw new Error("User not found")

  const doctor = await DoctorMongoModel.findById(appointment.doctorId).lean()
  if (!doctor) throw new Error("Doctor not found")

  const field = await MedicalFieldMongoModel.findById(appointment.medicalFieldId).lean()
  if (!field) throw new Error("Medical field not found")

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 })
    const chunks: Buffer[] = []

    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    doc.on("error", reject)

    // Title
    doc.fontSize(20).text("Appointment Summary", { align: "center" })
    doc.moveDown()

    // Details
    doc.fontSize(12)
    doc.text(`Patient: ${user.phone}`)
    doc.text(`Doctor: ${doctor.name}`)
    doc.text(`Field: ${field.name}`)
    doc.text(
      `Date: ${new Date(appointment.startAt).toLocaleString("en-GB", {
        dateStyle: "full", timeStyle: "short"})}`
    )
    doc.text(`Mode: ${appointment.virtual ? "Virtual" : "In-person"}`)
    doc.text(`Status: ${appointment.status}`)
    doc.moveDown()

    doc.text("Notes: This is a demo PDF generated on demand.", {
      align: "left",
    })

    doc.end()
  })
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



