import { useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { DoctorService } from '../../services/docor.service'
import { DoctorModel } from '../../models/doctor.model'
import { MedicalFieldModel } from '../../models/medicalField.model'
import { Rating } from '@mui/material'
import { LoadingSpinner } from '../../components/LoadingSpinner'

interface DoctorSelectorProps{
    currantDoctor: DoctorModel | null
    field: MedicalFieldModel
    onSelect : (field : DoctorModel) => void
}

export function DoctorSelector({ field, currantDoctor, onSelect } : DoctorSelectorProps){

    const [doctors, setDoctors] = useState<DoctorModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [favoritId, setFavoritId] = useState<string>('')

    useEffect(()=>{
        loadDoctors()
    },[])


    async function loadDoctors(){
        const doctors = await DoctorService.getDoctors(field._id)
        
        if(doctors) {
            // find favorite doctor before setting
            const ratedDoctors = doctors.filter(
                (doc): doc is DoctorModel & { rating: number } => 
                    doc.rating !== null && doc.rating !== undefined
            )

            if (ratedDoctors.length === 0) {
            setDoctors(doctors)
                setIsLoading(false)
                return
            }
            
            const favoriteDoc = ratedDoctors.reduce((acc, doc) => 
                doc.rating > acc.rating ? doc : acc, ratedDoctors[0])

            setFavoritId(favoriteDoc._id)

            // move favorite doctor to the top
            const sortedDoctors = [favoriteDoc, ...doctors.filter(doc => 
                doc._id !== favoriteDoc._id)]

            setDoctors(sortedDoctors)
            setIsLoading(false)
        }
    }



    if(isLoading) return <LoadingSpinner />

    return(
        <section className="doctor-selection">
            <h1>Select {field.name} Doctor</h1>
            <div className='auto-complete'>
                <Autocomplete
                    options={doctors}
                    value={currantDoctor}
                    getOptionLabel={option => option.name}
                    renderInput={params => <TextField {...params} label="Select Doctor" />}
                    onChange={(_, value) => { if (value) onSelect(value) }}
                    renderOption={(props, option) => {
                        const { key, ...rest } = props
                        return (
                        <li key={key} {...rest}>
                            <p>{option.name}</p>
                            {option._id === favoritId && 
                            <div className='unique'>
                                <p>Favorit</p>
                                <i className="fa-solid fa-star"/>
                            </div>
                            }
                        </li>
                        )
                    }}
                />
            </div>
            {
                currantDoctor &&
                <div className='doctor-info'>
                    <p>
                        Years of Experience: {new Date().getFullYear() - 
                        new Date(currantDoctor.experienceSince).getFullYear()}
                    </p>
                    <p> Education: {currantDoctor.educationFrom} </p>
                    <div className='rating'>
                        <p>Rating: </p>
                        <Rating 
                            value={currantDoctor.rating} 
                            precision={0.1} 
                            readOnly 
                            sx={{color: '#00006A'}}
                        />
                    </div>
                </div>
            }
        </section>
    )
}