import { DoctorModel } from "@/models/doctor.model"

interface DateSelectorProps{
    doctor: DoctorModel
    onSelect : (date : Date) => void
}

export function DateSelector({ doctor, onSelect } : DateSelectorProps){
    return(
        <section className="date-selector">
            <h1 onClick={()=>onSelect(new Date)}>Date Selector</h1>
        </section>
    )
}