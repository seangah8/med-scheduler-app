import { ObjectId } from "mongodb"

export interface DoctorModel {
    _id: string | ObjectId
    name: string
    medicalFieldIds: string[] | ObjectId[]
}