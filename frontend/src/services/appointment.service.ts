import { DoctorModel } from "../models/doctor.model"
import { httpService } from "./http.service"
import { AppointmentModel, AppointmentsResponse, AppointmentResponse } from "../models/appointment.model"
import { MedicalFieldModel } from "../models/medicalField.model"

export const AppointmentService = {
    getAppointmentsData,
    getAppointmentData,
    createAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getAllUnavailabilities,
    saveLocalBookingFlow,
    getLocalBookingFlow,
    deleteLocalBookingFlow,
    changeAppointmentMethod,
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
        const { appointment, doctor, medicalField } = 
            await httpService.get<AppointmentResponse>(`appointment/${id}`)
        // converting date string into Date type
        const finalAppointment: AppointmentModel = 
            {...appointment, startAt: new Date(appointment.startAt)}
        return {appointment: finalAppointment, doctor, medicalField}

    } catch(err){
        console.error('Could not get an appointment:', err)
        return null
    }
}

async function createAppointment(
    medicalFieldId: string, 
    doctorId: string, 
    date: Date, 
    virtual: boolean
) : Promise<AppointmentModel | null>{
    try{
        const appointment = await httpService.post<AppointmentModel>
            ('appointment/', {medicalFieldId, doctorId, date, virtual})
        return appointment

    } catch(err){
        console.error('Could not create an appointment:', err)
        return null
    }
}

async function cancelAppointment(id: string) : Promise<AppointmentModel | null>{
    try{
        const appointment = 
            await httpService.patch<AppointmentModel>(`appointment/cancel/${id}`)
        return appointment

    } catch(err){
        console.error('Could not cancel the appointment:', err)
        return null
    }
}

async function rescheduleAppointment(id: string, date: Date) : Promise<AppointmentModel | null>{
    try{
        const appointment = await httpService.patch<AppointmentModel>
            (`appointment/reschedule/${id}/${date}`)
        return appointment

    } catch(err){
        console.error('Could not reschedule the appointment:', err)
        return null
    }
}

async function changeAppointmentMethod(id: string, isVirtual: boolean) : Promise<AppointmentModel | null>{
    try{
        const appointment = await httpService.patch<AppointmentModel>
            (`appointment/virtual/${id}/${isVirtual}`)
        return appointment

    } catch(err){
        console.error('Could not change appointment visit method:', err)
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




function saveLocalBookingFlow(
    selectedField : MedicalFieldModel | null, 
    selectedDoctor : DoctorModel | null, 
    selectedDate : Date | null
){
    
    sessionStorage.setItem('bookingFlow', JSON.stringify({
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