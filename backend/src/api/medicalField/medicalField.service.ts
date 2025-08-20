import { MedicalFieldTSModel } from "../../models/typescript/medicalField.model"
import { MedicalFieldMongoModel } from "../../models/mongo/medicalField.model"
import { logger } from "../../services/logger.service"

export const medicalFieldService = {
  query,
  getById,
}

async function query(): Promise<MedicalFieldTSModel[]> {
  try {
    const medicalFieldsDoc = await MedicalFieldMongoModel.find().lean()
    const medicalFields : MedicalFieldTSModel[] = 
        medicalFieldsDoc.map(mf => ({...mf, _id: mf._id.toString()}))
    return medicalFields

  } catch (err : any) {
    logger.error(`failed to get medical fields: ${err.message}`)
    throw err
  }
}


async function getById(id: string): Promise<MedicalFieldTSModel | null> {
  try {
    const medicalFieldDoc = await MedicalFieldMongoModel.findOne({ _id: id }).lean()
    if (!medicalFieldDoc) return null
    const medicalField: MedicalFieldTSModel = { ...medicalFieldDoc, _id: medicalFieldDoc._id.toString() }
    return medicalField

  } catch (err : any) {
    logger.error(`Failed to get medical field by id: ${err.message}`)
    throw err
  }
}