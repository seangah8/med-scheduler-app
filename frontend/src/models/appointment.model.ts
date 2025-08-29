import { DoctorModel } from "./doctor.model"
import { MedicalFieldModel } from "./medicalField.model"

export interface AppointmentModel {
    _id: string
    userId: string
    medicalFieldId: string
    doctorId: string
    startAt: Date
    virtual: boolean
    status: 'scheduled' | 'completed' | 'cancelled'
}

export interface AppointmentsResponseModel {
    appointments: AppointmentModel[]
    doctorMap: Record<string, string>      
    medicalFieldMap: Record<string, string>
}

export interface AppointmentResponseModel {
    appointment: AppointmentModel
    doctor: DoctorModel   
    medicalField: MedicalFieldModel
}

export interface AppointmentFilterModel{
  status: 'scheduled' | 'completed' | 'cancelled'
  medicalFieldId?: string
  startDate?: Date
  endDate?: Date
}

