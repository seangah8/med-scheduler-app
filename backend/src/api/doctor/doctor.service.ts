import { DoctorTSModel } from "../../models/typescript/doctor.model"
import { DoctorMongoModel } from "../../models/mongo/doctor.model"
import { logger } from "../../services/logger.service"

export const doctorService = {
  query,
}

async function query(medicalFieldId: string): Promise<DoctorTSModel[]> {
  try {
    const doctors = await DoctorMongoModel.find({ medicalFieldIds: medicalFieldId }).lean()
    const finalDoctors: DoctorTSModel[] = doctors.map(doc => ({
      ...doc, _id: doc._id.toString()}))
    return finalDoctors

  } catch (err: any) {
    logger.error(`Failed to get doctors for medicalFieldId ${medicalFieldId}: ${err.message}`)
    throw err
  }
}
