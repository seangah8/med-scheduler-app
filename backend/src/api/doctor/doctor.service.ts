import { DoctorTSModel } from "../../models/typescript/doctor.model"
import { DoctorMongoModel } from "../../models/mongo/doctor.model"
import { logger } from "../../services/logger.service"

export const doctorService = {
  query,
  getById,
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

