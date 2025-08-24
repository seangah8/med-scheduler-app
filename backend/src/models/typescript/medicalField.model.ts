import { ObjectId } from "mongodb"

export interface MedicalFieldTSModel {
    _id: string | ObjectId
    name: string
    details: string
    requiredInfo: string | null
}