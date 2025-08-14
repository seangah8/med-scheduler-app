import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({

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

// prevent double booking the same doctor at the same time
appointmentSchema.index({ doctorId: 1, startAt: 1 }, { unique: true })

// optimize queries that fetch a user's appointments
// sorted by date (newest first)
appointmentSchema.index({ userId: 1, startAt: -1 })

const AppointmentMongoModel = mongoose.model('appointment', appointmentSchema)
export { AppointmentMongoModel }
