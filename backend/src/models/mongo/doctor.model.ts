import mongoose from "mongoose"


const doctorSchema = new mongoose.Schema({

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

const DoctorMongoModel = mongoose.model('doctor', doctorSchema)
export { DoctorMongoModel }
