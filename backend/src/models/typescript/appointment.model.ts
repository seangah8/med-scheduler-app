import { ObjectId } from "mongodb"

export interface AppointmentTSModel {
    _id: string | ObjectId
    userId: string | ObjectId
    medicalFieldId: string | ObjectId
    doctorId: string | ObjectId
    startAt: Date
    status: 'scheduled' | 'completed' | 'cancelled'
}