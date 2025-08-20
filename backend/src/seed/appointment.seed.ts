import { faker } from '@faker-js/faker'
import { AppointmentMongoModel } from "../models/mongo/appointment.model"
import { UserTSModel } from '../models/typescript/user.model'
import { DoctorTSModel } from '../models/typescript/doctor.model'
import { Types } from 'mongoose'


export async function seedAppointments(
  users: (UserTSModel & { _id: Types.ObjectId })[],
  doctors: (DoctorTSModel & { _id: Types.ObjectId })[],
  amount: number,
  monthsAhead: number
) {
  const usedSlots = new Set<string>()
  const appointments = []

  while (appointments.length < amount) {
    const user = faker.helpers.arrayElement(users)
    const doctor = faker.helpers.arrayElement(doctors)

    // pick a fieldWorkdays entry
    const fieldEntry = faker.helpers.arrayElement(doctor.schedule.fieldWorkdays)
    const medicalFieldId = fieldEntry.medicalFieldId
    const availableDays = fieldEntry.days

    // generate a valid appointment date within 6 months
    let start: Date
    while (true) {
      const randomDaysAhead = faker.number.int({ min: 0, max: monthsAhead * 30 })
      const date = new Date()
      date.setDate(date.getDate() + randomDaysAhead)

      const dayOfWeek = date.getDay()
      if (availableDays.includes(dayOfWeek)) {
        const hour = faker.number.int({ min: 8, max: 15 })
        const minute = faker.helpers.arrayElement([0, 15, 30, 45])

        date.setHours(hour, minute, 0, 0)
        start = date
        break
      }
    }

    // avoid double-booking the doctor at the same time
    const key = `${doctor._id}_${start.toISOString()}`
    if (usedSlots.has(key)) continue
    usedSlots.add(key)

    appointments.push({
      userId: user._id,
      doctorId: doctor._id,
      medicalFieldId,
      startAt: start,
      status: faker.helpers.arrayElement(['scheduled', 'completed', 'cancelled']),
    })
  }

  await AppointmentMongoModel.insertMany(appointments)
}
