
export interface AppointmentModel {
    _id: string
    userId: string
    medicalFieldId: string
    doctorId: string
    startAt: Date
    status: 'scheduled' | 'completed' | 'cancelled'
}

export interface AppointmentsResponse {
    appointments: AppointmentModel[]
    doctorMap: Record<string, string>      
    medicalFieldMap: Record<string, string>
}

export interface AppointmentResponse {
    appointment: AppointmentModel
    doctorName: string   
    medicalFieldName: string
}

