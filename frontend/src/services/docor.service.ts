import { httpService } from "./http.service"
import { DoctorModel } from "@/models/doctor.model"

export const DoctorService = {
    getDoctors,
}


async function getDoctors(medicalFieldId : string) : Promise<DoctorModel[] | null> {
    try{
        const doctors = await httpService.get<DoctorModel[]>(`doctor/${medicalFieldId}`)
        return doctors
    } catch(err){
        console.log('Could not get doctors:', err)
        return null
    }
}