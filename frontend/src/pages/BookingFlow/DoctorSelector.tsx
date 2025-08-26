import { useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { DoctorService } from '../../services/docor.service'
import { DoctorModel } from '../../models/doctor.model'
import { MedicalFieldModel } from '../../models/medicalField.model'
import { Rating } from '@mui/material'

interface DoctorSelectorProps{
    currantDoctor: DoctorModel | null
    field: MedicalFieldModel
    onSelect : (field : DoctorModel) => void
}

export function DoctorSelector({ field, currantDoctor, onSelect } : DoctorSelectorProps){

    const [doctors, setDoctors] = useState<DoctorModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(()=>{
        loadDoctors()
    },[])

    async function loadDoctors(){
        const doctors = await DoctorService.getDoctors(field._id)
        if(doctors) {
            setDoctors(doctors)
            setIsLoading(false)
        }
    }

    if(isLoading) return <h3>Loading...</h3>

    return(
        <section className="doctor-selection">
            <h1>Select Doctor From This Field</h1>
            <Autocomplete
                options={doctors}
                value={currantDoctor}
                getOptionLabel={option => option.name}
                renderInput={params => <TextField {...params} label="Select Doctor" />}
                onChange={(_, value) => {if (value) onSelect(value)}}
            />
            {
                currantDoctor &&
                <div className='doctor-info'>
                    <p>
                        Years of Experience: {new Date().getFullYear() - 
                        new Date(currantDoctor.experienceSince).getFullYear()}
                    </p>
                    <p> Education: {currantDoctor.educationFrom} </p>
                    <div>
                        <p>Rating</p>
                        <Rating value={currantDoctor.rating} precision={0.1} readOnly/>
                    </div>
                </div>
            }
        </section>
    )
}