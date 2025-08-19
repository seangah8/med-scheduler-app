import { connectDB } from '../config/database'
import { logger } from '../services/logger.service'

import { UserMongoModel } from '../models/mongo/user.model'
import { MedicalFieldMongoModel } from '../models/mongo/medicalField.model'
import { DoctorMongoModel } from '../models/mongo/doctor.model'
import { AppointmentMongoModel } from '../models/mongo/appointment.model'
import { seedDoctors } from './doctor.seed'
import { seedMedicalFields } from './medicalField.seed'
import { seedAppointments } from './appointment.seed'
import { seedUsers } from './user.seed'

async function seedDatabase() {

  const amount = {users: 10, doctors: 100, apointments: 10000}

  try{

    // connecting to database
    await connectDB()

    // clear database
    logger.info(`clearing database...`)
    await Promise.all([
      MedicalFieldMongoModel.deleteMany({}),
      DoctorMongoModel.deleteMany({}),
      UserMongoModel.deleteMany({}),
      AppointmentMongoModel.deleteMany({}),
    ])

    // seeding database
    logger.info(`seeding users...`)
    const users = await seedUsers(amount.users)

    logger.info(`seeding medical fields...`)
    const medicalFields = await seedMedicalFields()

    logger.info(`seeding doctors...`)
    const doctors = await seedDoctors(medicalFields, amount.doctors)

    logger.info(`seeding appointments...`)
    await seedAppointments(users, doctors, amount.apointments)

    logger.info('seeding complete')
    process.exit(0)

  } catch(err){
    logger.error(err, 'seeding failed:')
    process.exit(1)
  }
  
}


// running the file
seedDatabase()
