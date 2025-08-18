import { MedicalFieldTSModel } from "../../models/typescript/medicalField.model"
import { MedicalFieldMongoModel } from "../../models/mongo/medicalField.model"
import { logger } from "../../services/logger.service"

export const medicalFieldService = {
  query,
}

async function query(): Promise<MedicalFieldTSModel[]> {
  try {
    const medicalFields = await MedicalFieldMongoModel.find().lean()
    const finalMedicalFields : MedicalFieldTSModel[] = 
        medicalFields.map(mf => ({...mf, _id: mf._id.toString()}))
    return finalMedicalFields

  } catch (err : any) {
    logger.error(`failed to get medical fields: ${err.message}`)
    throw err
  }
}