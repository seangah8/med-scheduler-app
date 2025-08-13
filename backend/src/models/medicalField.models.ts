import { ObjectId } from "mongodb"

export interface MedicalFieldModel {
    _id: string | ObjectId
    name: string
}