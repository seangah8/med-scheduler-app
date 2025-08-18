
export interface DoctorTSModel {
  _id: string
  name: string
  schedule: {
    start: string       
    end: string          
    intervalMinutes: number
    breaks: {start: string, end: string }[]
    fieldWorkdays: { medicalFieldId: string, days: number[] }[]
  }
}