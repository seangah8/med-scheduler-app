import mongoose from "mongoose"
import { AppointmentTSModel } from "../typescript/appointment.model"

// omit _id to avoid conflict with mongoose's document type
type AppointmentDocument = Omit<AppointmentTSModel, '_id'> & Document

const appointmentSchema = new mongoose.Schema<AppointmentDocument>({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },

  medicalFieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalField',
    required: true,
  },

  startAt: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },

}, {versionKey: false})  // disables __v

// optimize queries that fetch a user's appointments
// sorted by date (newest first)
appointmentSchema.index({ userId: 1, status: 1, startAt: -1 })

// optimize queries that fetch future appointment
// to check unavailable booking dates
appointmentSchema.index({ doctorId: 1, medicalFieldId: 1, startAt: 1, status: 1 })

// prevent booking doctor at the same time
appointmentSchema.index(
  { doctorId: 1, startAt: 1 },
  { unique: true, partialFilterExpression: { status: 'scheduled' }}
)

const AppointmentMongoModel = 
  mongoose.model<AppointmentDocument>('appointment', appointmentSchema)
export { AppointmentMongoModel }
