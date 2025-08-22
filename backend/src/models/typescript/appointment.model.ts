import { ObjectId } from "mongodb"

export interface AppointmentTSModel {
    _id: string | ObjectId
    userId: string | ObjectId
    medicalFieldId: string | ObjectId
    doctorId: string | ObjectId
    startAt: Date
    status: 'scheduled' | 'completed' | 'cancelled'
}

export type PopulatedAppointment 
    = Omit<AppointmentTSModel, 'doctorId' | 'medicalFieldId'> & {
  doctorId: { _id: ObjectId; name: string }
  medicalFieldId: { _id: ObjectId; name: string }
}
