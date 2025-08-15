import mongoose from "mongoose"
import { DoctorTSModel } from "../typescript/doctor.model"

// omit _id to avoid conflict with mongoose's document type
type DoctorDocument = Omit<DoctorTSModel, '_id'> & Document

const doctorSchema = new mongoose.Schema<DoctorDocument>({

  name: {
    type: String,
    required: true,
  },

  medicalFieldIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalField',
  }],

}, {versionKey: false})  // disables __v

// optimize queries that fetch a medical field's doctors
doctorSchema.index({ medicalFieldIds: 1 })

const DoctorMongoModel = mongoose.model<DoctorDocument>('doctor', doctorSchema)
export { DoctorMongoModel }
