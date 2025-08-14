import mongoose from "mongoose"

const medicalFieldSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true,
  },

}, {versionKey: false})  // disables __v

const MedicalFieldMongoModel = mongoose.model('medical_field', medicalFieldSchema)
export { MedicalFieldMongoModel }