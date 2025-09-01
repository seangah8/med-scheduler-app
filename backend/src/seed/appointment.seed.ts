import { faker } from '@faker-js/faker'
import { AppointmentMongoModel } from "../models/mongo/appointment.model"
import { UserTSModel } from '../models/typescript/user.model'
import { DoctorTSModel } from '../models/typescript/doctor.model'
import { Types } from 'mongoose'


export async function seedAppointments(
  users: (UserTSModel & { _id: Types.ObjectId })[],
  doctors: (DoctorTSModel & { _id: Types.ObjectId })[],
  minAppsPreDoctor: number,
  maxAppsPreDoctor: number
) {

  const appointments: any[] = []
  const now = new Date()

  for (const doctor of doctors) {

    const slotsAmount = faker.number.int({ min: minAppsPreDoctor, max: maxAppsPreDoctor })
    let created = 0
    let current = new Date()

    while (created < slotsAmount) {
      const dayOfWeek = current.getDay()
      const fieldEntry = doctor.schedule.fieldWorkdays.find(f => f.days.includes(dayOfWeek))

      if (fieldEntry) {
        const startHour = parseInt(doctor.schedule.start.split(':')[0])
        const startMin = parseInt(doctor.schedule.start.split(':')[1])
        const endHour = parseInt(doctor.schedule.end.split(':')[0])
        const endMin = parseInt(doctor.schedule.end.split(':')[1])

        const startOfDay = new Date(current)
        startOfDay.setHours(startHour, startMin, 0, 0)

        const endOfDay = new Date(current)
        endOfDay.setHours(endHour, endMin, 0, 0)
        let slot = new Date(startOfDay)

        while (slot < endOfDay && created < slotsAmount) {
          // skip breaks
          const inBreak = doctor.schedule.breaks.some(b => {
            const bStart = new Date(current)
            bStart.setHours(parseInt(b.start.split(':')[0]), parseInt(b.start.split(':')[1]))
            const bEnd = new Date(current)
            bEnd.setHours(parseInt(b.end.split(':')[0]), parseInt(b.end.split(':')[1]))
            return slot >= bStart && slot < bEnd
          })
          if (!inBreak) {
            const user = faker.helpers.arrayElement(users)
            appointments.push({
              userId: user._id,
              doctorId: doctor._id,
              medicalFieldId: fieldEntry.medicalFieldId,
              startAt: new Date(slot),
              createdAt: now,
              virtual: Math.random() < 0.5,
              status: 'scheduled',
            })
            created++
          }
          slot = new Date(slot.getTime() + doctor.schedule.intervalMinutes * 60000)
        }
      }
      current.setDate(current.getDate() + 1)
    }
  }

  await AppointmentMongoModel.insertMany(appointments)
}
