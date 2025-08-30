import { useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { medicalFieldService } from '../../services/medicalField.service'
import { MedicalFieldModel } from "../../models/medicalField.model"
import { LoadingSpinner } from '../../components/LoadingSpinner'

interface MedicalFieldSelectorProps{
    currantField: MedicalFieldModel | null
    appointmentOnFieldExists: boolean
    onSelect : (field : MedicalFieldModel | null) => void
}

export function MedicalFieldSelector({ currantField, appointmentOnFieldExists, onSelect } : MedicalFieldSelectorProps){

    const [medicalFields, setMedicalFields] = useState<MedicalFieldModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(()=>{
        loadMedicalFields()
    },[])

    async function loadMedicalFields(){
        const fields = await medicalFieldService.getMedicalFields()
        if(fields) {
            setMedicalFields(fields)
            setIsLoading(false)
        }
        
    }

    if(isLoading) return <LoadingSpinner />

    return(
        <section className="medical-field-selection">
            <h1>Select Medical Field</h1>
            <div className='auto-complete'>
                <Autocomplete
                    options={medicalFields}
                    value={currantField}
                    getOptionLabel={option => option.name}
                    renderInput={params => <TextField {...params} label="Select Medical Field" />}
                    onChange={(_, value) => {if (value) onSelect(value)}}
                />
            </div>
            {currantField && <p>{currantField.details}</p>}
            {
                appointmentOnFieldExists && <p className='notice-text'>
                    <span>notice:</span> you wont be able book appointment in this field - already have one
                </p>
            }
        </section>
    )
}