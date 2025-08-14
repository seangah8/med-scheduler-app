import { faker } from '@faker-js/faker'
import { connectDB } from '../config/database'
import { logger } from '../services/logger.service'

import { UserMongoModel } from '../models/mongo/user.model'
import { MedicalFieldMongoModel } from '../models/mongo/medicalField.model'
import { DoctorMongoModel } from '../models/mongo/doctor.model'
import { AppointmentMongoModel } from '../models/mongo/appointment.model'

async function runSeeding() {
  try {
    await seedDatabase()
    logger.info('seeding complete')
    process.exit(0)
  } catch (err) {
    logger.error(err, 'seeding failed:')
    process.exit(1)
  }
}


async function seedDatabase() {
  await connectDB()

  logger.info(`clearing database...`)
  await Promise.all([
    MedicalFieldMongoModel.deleteMany({}),
    DoctorMongoModel.deleteMany({}),
    UserMongoModel.deleteMany({}),
    AppointmentMongoModel.deleteMany({}),
  ]);

  logger.info(`seeding users...`)
  const users = await UserMongoModel.insertMany(
    Array.from({ length: 10 }).map(() => ({
        phone: `05${faker.number.int({ min: 10000000, max: 99999999 })}`,
    }))
  )

  logger.info(`seeding medical fields...`)
  const fieldNames = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Oncology']
  const medicalFields = await MedicalFieldMongoModel.insertMany(
    fieldNames.map(name => ({ name }))
  )

  logger.info(`seeding doctors...`)
  const doctors = await DoctorMongoModel.insertMany(
    Array.from({ length: 100 }).map(() => {
      const numFields = faker.number.int({ min: 1, max: 3 })
      const fieldIds = faker.helpers.arrayElements(medicalFields, numFields).map(f => f._id)
      return {
        name: faker.person.fullName(),
        medicalFieldIds: fieldIds,
      }
    })
  )

  logger.info(`seeding appointments...`)
  const usedSlots = new Set<string>()
  const appointments = []

  while (appointments.length < 100) {
    const user = faker.helpers.arrayElement(users)
    const doctor = faker.helpers.arrayElement(doctors)
    const medicalFieldId = faker.helpers.arrayElement(doctor.medicalFieldIds)


    // Generate a valid appointment slot: next 6 months, 
    // 08:00–16:00, Sunday–Thursday, 15-min intervals
    let start: Date
    while (true) {
        const randomDaysAhead = faker.number.int({ min: 0, max: 180 })
        const date = new Date()
        date.setDate(date.getDate() + randomDaysAhead)

        const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday

        if (dayOfWeek >= 0 && dayOfWeek <= 4) { // Sunday to Thursday only
            const hour = faker.number.int({ min: 8, max: 15 }) // 08 to 15
            const minute = faker.helpers.arrayElement([0, 15, 30, 45])

            date.setHours(hour, minute, 0, 0)
            start = date
            break
        }
    }

    // avoid booking appointment on the same time with the same doctor
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


// running the file
runSeeding()
