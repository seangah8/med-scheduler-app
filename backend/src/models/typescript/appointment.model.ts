import { ObjectId } from "mongodb"
import { DoctorTSModel } from "./doctor.model"
import { MedicalFieldTSModel } from "./medicalField.model"

export interface AppointmentTSModel {
    _id: string | ObjectId
    userId: string | ObjectId
    medicalFieldId: string | ObjectId
    doctorId: string | ObjectId
    startAt: Date
    createdAt: Date
    virtual: boolean
    status: 'scheduled' | 'completed' | 'cancelled'
}

export type PopulatedAppointment 
    = Omit<AppointmentTSModel, 'doctorId' | 'medicalFieldId'> & {
  doctorId: DoctorTSModel
  medicalFieldId: MedicalFieldTSModel
}

export type NamePopulatedAppointment 
    = Omit<AppointmentTSModel, 'doctorId' | 'medicalFieldId'> & {
  doctorId: { _id: ObjectId; name: string }
  medicalFieldId: { _id: ObjectId; name: string }
}



