import mongoose, { Document } from 'mongoose'
import { MedicalFieldTSModel } from '../typescript/medicalField.model'

// omit _id to avoid conflict with mongoose's document type
type MedicalFieldMongoDocument = Omit<MedicalFieldTSModel, '_id'> & Document

const medicalFieldSchema = new mongoose.Schema<MedicalFieldMongoDocument>({

  name: {
    type: String,
    required: true,
    unique: true,
  },

})

const MedicalFieldMongoModel = mongoose.model('medicalField', medicalFieldSchema)
export default MedicalFieldMongoModel