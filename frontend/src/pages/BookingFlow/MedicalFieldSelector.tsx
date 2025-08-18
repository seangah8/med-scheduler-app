import { useEffect, useState } from 'react'
import { medicalFieldService } from '../../services/medicalField.service'
import { MedicalFieldModel } from "../../models/medicalField.model"

interface MedicalFieldSelectorProps{
    onSelect : (field : MedicalFieldModel) => void
}

export function MedicalFieldSelector({ onSelect } : MedicalFieldSelectorProps){

    const [medicalFields, setMedicalFields] = useState<MedicalFieldModel[]>([])

    useEffect(()=>{
        loadMedicalFields()
    },[])

    async function loadMedicalFields(){
        const fields = await medicalFieldService.getMedicalFields()
        if(fields) setMedicalFields(fields)
    }

    return(
        <section className="medical-field-selection">
            <h1>Medical Field Selection</h1>
            <ul>
                {
                    medicalFields.map(mf =>
                        <li key={mf._id} onClick={()=>onSelect(mf)}>
                            {mf.name}
                        </li>
                    )
                }
            </ul>
        </section>
    )
}