import { faker } from '@faker-js/faker'
import mongoose from 'mongoose'
import { DoctorMongoModel } from '../models/mongo/doctor.model'
import { DoctorTSModel } from '../models/typescript/doctor.model'
import { logger } from '../services/logger.service'
import { MedicalFieldTSModel } from '../models/typescript/medicalField.model'

export async function seedDoctors( medicalFields  : MedicalFieldTSModel[]) : Promise<(DoctorTSModel & { _id: mongoose.Types.ObjectId })[]> {
  try {

    const doctors = []

    for (let i = 0; i < 100; i++) {
        
        // name
        const name = faker.person.fullName()

        // doctor's fileds
        const numFields = faker.number.int({ min: 1, max: 3 })
        const fieldDocs = faker.helpers.arrayElements(medicalFields, numFields)
        const fieldIds = fieldDocs.map(f => f._id)

        // schedule layout (moke -> all work from 8:00 to 16:00, 
        // each appointment 15 mimn)
        const intervalMinutes = 15
        const scheduleStartHour = 8
        const scheduleEndHour = 16

        // breaks (moke -> everyone have the same breaks)
        const breaks = [
            { start: '13:00', end: '13:30' },
            { start: '10:30', end: '11:00' }]

        // days of work (moke -> Sun-Thu)
        const allDays = faker.helpers.shuffle([0, 1, 2, 3, 4]) 
        const fieldWorkdaysMap = new Map<string, number[]>()

        // rotate days between fields: field1 → day0, field2 → day1, ...
        for (let i = 0; i < allDays.length; i++) {
            const fieldId = fieldIds[i % fieldIds.length].toString()
            if (!fieldWorkdaysMap.has(fieldId)) {
                fieldWorkdaysMap.set(fieldId, [])
            }
            fieldWorkdaysMap.get(fieldId)!.push(allDays[i])
        } 

        // convert to array format for schema
        const fieldWorkdays = Array.from(fieldWorkdaysMap.entries())
            .map(([medicalFieldId, days]) => ({ medicalFieldId, days }))

        doctors.push({
            name,
            schedule: {
            start: `${scheduleStartHour.toString().padStart(2, '0')}:00`,
            end: `${scheduleEndHour.toString().padStart(2, '0')}:00`,
            intervalMinutes,
            breaks,
            fieldWorkdays
            }
        })
    }

    const insertedDoctors = await DoctorMongoModel.insertMany(doctors)
    const plainDocs = insertedDoctors.map(doc => doc.toObject()) // convert to POJOs
    return plainDocs as (DoctorTSModel & { _id: mongoose.Types.ObjectId })[]
    
  } catch (err: any) {
    logger.error(`failed to seed doctors: ${err.message}`)
    return []
  }
}
