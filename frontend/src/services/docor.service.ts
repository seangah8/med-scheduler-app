import { httpService } from "./http.service"
import { DoctorModel } from "@/models/doctor.model"

export const DoctorService = {
    getDoctors,
    getSoonestAvailableDoctor,
    reorderDoctors,
}


async function getDoctors(medicalFieldId : string) : Promise<DoctorModel[] | null> {
    try{
        const doctors = await httpService.get<DoctorModel[]>(`doctor/${medicalFieldId}`)
        return doctors
    } catch(err){
        console.error('Could not get doctors:', err)
        return null
    }
}

export async function getSoonestAvailableDoctor(
  doctorsId: string[],
  fieldId: string
): Promise<string | null> {

  try {
    const doctorId = await httpService.post<string>(
      'doctor/soonest-available',
      { doctorsId, fieldId }
    )
    return doctorId

  } catch (err) {
    console.error("Failed to fetch soonest available doctor:", err)
    return null
  }
}


export function reorderDoctors(
  doctors: DoctorModel[],
  favoriteDoctor: DoctorModel | null,
  soonestDoctorId: string | null
): DoctorModel[] {

  let sortedDoctors = [...doctors]

  if (favoriteDoctor && soonestDoctorId) {
    // same doctor is both favorite and soonest -> favorite first
    if (favoriteDoctor._id === soonestDoctorId) {
      sortedDoctors = [ favoriteDoctor,
        ...doctors.filter(d => d._id !== favoriteDoctor._id)]
    } 

    // different doctors -> favorite first, soonest second
    else {
      const soonestDoc = doctors.find(d => d._id === soonestDoctorId)
      if (soonestDoc) {
        sortedDoctors = [favoriteDoctor, soonestDoc, ...doctors.filter(
            d => d._id !== favoriteDoctor._id && d._id !== soonestDoc._id)]
      }
    }
  } 

  // only favorite -> favorite first
  else if (favoriteDoctor) {
    sortedDoctors = [favoriteDoctor, ...doctors.filter(d => 
        d._id !== favoriteDoctor._id)]
  } 

  // only soonest -> soonest first
  else if (soonestDoctorId) {
    const soonestDoc = doctors.find(d => d._id === soonestDoctorId)
    if (soonestDoc) {
      sortedDoctors = [soonestDoc, ...doctors.filter(d => 
        d._id !== soonestDoc._id)]
    }
  }

  // neither -> keep original order

  return sortedDoctors
}

