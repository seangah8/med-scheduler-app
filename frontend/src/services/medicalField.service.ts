import { httpService } from "./http.service"
import { MedicalFieldModel } from "@/models/medicalField.model"

export const medicalFieldService = {
    getMedicalFields,
}


async function getMedicalFields() : Promise<MedicalFieldModel[] | null> {
    try{
        const medicalFields = await httpService.get
            <MedicalFieldModel[]>('medical-field/')
        return medicalFields
    } catch(err){
        console.log('Could not get medical fields:', err)
        return null
    }
}