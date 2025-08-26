import mongoose, { Document } from "mongoose"
import { DoctorTSModel } from "../typescript/doctor.model"

// omit _id from ts type to avoid mongoose conflict
type DoctorDocument = Omit<DoctorTSModel, '_id'> & Document

const doctorSchema = new mongoose.Schema<DoctorDocument>({
  name: {
    type: String,
    required: true,
  },

  experienceSince: {
    type: Date,
    required: true,
  },

  educationFrom: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    default: null
  },

  schedule: {

    start: {
      type: String, // "08:00"
      required: true,
    },

    end: {
      type: String, // "17:00"
      required: true,
    },

    intervalMinutes: {
      type: Number,
      required: true,
    },

    breaks: [{
      start: { type: String, required: true },
      end: { type: String, required: true },  
      _id: false 
    }],

    fieldWorkdays: [{
      medicalFieldId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalField',
        required: true,
      },
      days: {
        type: [Number],
        required: true,
      },
      _id: false
    }]
  }

}, { versionKey: false }) // disables __v

// optimize search for doctors by field
doctorSchema.index({ "schedule.fieldWorkdays.medicalFieldId": 1 })

const DoctorMongoModel = mongoose.model<DoctorDocument>('doctor', doctorSchema)
export { DoctorMongoModel }
