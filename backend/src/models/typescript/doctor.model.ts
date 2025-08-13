import { ObjectId } from "mongodb"

export interface DoctorTSModel {
    _id: string | ObjectId
    name: string
    medicalFieldIds: string[] | ObjectId[]
}