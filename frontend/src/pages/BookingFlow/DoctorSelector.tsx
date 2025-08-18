import { useEffect, useState } from 'react'
import { DoctorService } from '../../services/docor.service'
import { DoctorModel } from '../../models/doctor.model'
import { MedicalFieldModel } from '../../models/medicalField.model'

interface DoctorSelectorProps{
    field: MedicalFieldModel
    onSelect : (field : DoctorModel) => void
}

export function DoctorSelector({ field, onSelect } : DoctorSelectorProps){

    const [doctors, setDoctors] = useState<DoctorModel[]>([])

    useEffect(()=>{
        loadDoctors()
    },[])

    async function loadDoctors(){
        const doctors = await DoctorService.getDoctors(field._id)
        if(doctors) setDoctors(doctors)
    }

    return(
        <section className="doctor-selection">
            <h1>Doctor Selection</h1>
            <ul>
                {
                    doctors.map(doctor =>
                        <li key={doctor._id} onClick={()=>onSelect(doctor)}>
                            {doctor.name}
                        </li>
                    )
                }
            </ul>
        </section>
    )
}