
export interface AppointmentModel {
    _id: string
    userId: string
    medicalFieldId: string
    doctorId: string
    startAt: Date
    status: 'scheduled' | 'completed' | 'cancelled'
}