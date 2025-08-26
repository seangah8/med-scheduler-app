
export interface DoctorModel {
  _id: string
  name: string
  experienceSince: Date
  educationFrom: string
  rating: number | null
  schedule: {
    start: string       
    end: string          
    intervalMinutes: number
    breaks: {start: string, end: string }[]
    fieldWorkdays: { medicalFieldId: string, days: number[] }[]
  }
}