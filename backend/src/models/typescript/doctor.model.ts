import { ObjectId } from "mongodb"

export interface DoctorTSModel {
  _id: string | ObjectId
  name: string
  experienceSince: Date
  educationFrom: string
  rating: number | null
  schedule: {
    start: string       
    end: string          
    intervalMinutes: number
    breaks: {start: string, end: string }[]
    fieldWorkdays: { medicalFieldId: string | ObjectId, days: number[] }[]
  }
}
