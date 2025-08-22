import { DoctorModel } from "../models/doctor.model"
import { httpService } from "./http.service"
import { AppointmentModel, AppointmentsResponse, AppointmentResponse } from "../models/appointment.model"
import { MedicalFieldModel } from "../models/medicalField.model"

export const AppointmentService = {
    getAppointmentsData,
    getAppointmentData,
    createAppointment,
    getAllUnavailabilities,
    getAvailableSlots,
    saveLocalBookingFlow,
    getLocalBookingFlow,
    deleteLocalBookingFlow,
}

async function getAppointmentsData(status : string)
    : Promise<AppointmentsResponse | null>{
    try{
        const {appointments, doctorMap, medicalFieldMap} = 
            await httpService.get<AppointmentsResponse>(`appointment?status=${status}`)
        // converting date string into Date type
        const finalAppointments: AppointmentModel[] = appointments.map(app => 
            ({...app, startAt: new Date(app.startAt)}))
        return {appointments: finalAppointments, doctorMap, medicalFieldMap}

    } catch(err){
        console.error('Could not get an appointments:', err)
        return null
    }
}

async function getAppointmentData(id : string)
    : Promise<AppointmentResponse | null>{
    try{
        const {appointment, doctorName, medicalFieldName} = 
            await httpService.get<AppointmentResponse>(`appointment/${id}`)
        // converting date string into Date type
        const finalAppointment: AppointmentModel = 
            {...appointment, startAt: new Date(appointment.startAt)}
        return {appointment: finalAppointment, doctorName, medicalFieldName}

    } catch(err){
        console.error('Could not get an appointment:', err)
        return null
    }
}

async function createAppointment(medicalFieldId: string, doctorId: string, date: Date)
    : Promise<AppointmentModel | null>{
    try{
        const appointment = await httpService.post<AppointmentModel>
            ('appointment/', {medicalFieldId, doctorId, date})
        return appointment

    } catch(err){
        console.error('Could not create an appointment:', err)
        return null
    }
}

// unavailableDays: days that are completely booked ["2025-08-22", "2025-08-24", ...]
// unavailableSlots: in other days, booked slots ["2025-08-23T10:15:00Z", ...]
async function getAllUnavailabilities(medicalFieldId: string, doctorId: string)
    : Promise<{ unavailableDays: string[], unavailableSlots: string[] } | null> {

    try {
        const allUnavailability = await httpService.get
            <{unavailableDays: string[], unavailableSlots: string[]}>
                (`appointment/unavailable-dates/${medicalFieldId}/${doctorId}`)
        return allUnavailability

    } catch (err) {
        console.error('Could not get unavailable dates:', err)
        return null
    }
}


function getAvailableSlots(date: Date, doctor: DoctorModel, unavailableSet: Set<string>): Date[] {
    const { start, end, intervalMinutes, breaks } = doctor.schedule

    const availableSlots: Date[] = []
    const chosenDate = new Date(date)

    // convert working hours to numbers
    const [startHour, startMin] = start.split(':').map(Number)
    const [endHour, endMin] = end.split(':').map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    for (let current = startMinutes; current < endMinutes; current += intervalMinutes) {
        const hours = Math.floor(current / 60)
        const minutes = current % 60

        const slot = new Date(chosenDate)
        slot.setHours(hours, minutes, 0, 0)

        // check if slot is in a break
        const isInBreak = breaks.some(b => {
            const [sh, sm] = b.start.split(':').map(Number)
            const [eh, em] = b.end.split(':').map(Number)

            const breakStart = sh * 60 + sm
            const breakEnd = eh * 60 + em

            return current >= breakStart && current < breakEnd
        })

        if (isInBreak) continue

        // check if this slot is unavailable
        if (unavailableSet.has(slot.toISOString())) continue

        // if passed all filters add to available
        availableSlots.push(slot)
    }

    return availableSlots
}

function saveLocalBookingFlow(
    stepNumber : number | null, 
    selectedField : MedicalFieldModel | null, 
    selectedDoctor : DoctorModel | null, 
    selectedDate : Date | null
){
    
    sessionStorage.setItem('bookingFlow', JSON.stringify({stepNumber, 
        selectedField, selectedDoctor, selectedDate}))
}

function getLocalBookingFlow() : {
    stepNumber : number, 
    selectedField : MedicalFieldModel | null, 
    selectedDoctor : DoctorModel | null, 
    selectedDate : Date | null
    } | null{

  const bookingFlowStr = sessionStorage.getItem('bookingFlow')
  if(!bookingFlowStr) return null
  return JSON.parse(bookingFlowStr)
}

function deleteLocalBookingFlow() {
  sessionStorage.removeItem("bookingFlow")
}