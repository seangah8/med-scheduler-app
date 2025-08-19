import { useState, useRef, useEffect } from "react"
import { DoctorModel } from "@/models/doctor.model"
import { MedicalFieldModel } from "@/models/medicalField.model"
import { AppointmentService } from "../../services/appointment.service"

interface DateSelectorProps{
    doctor: DoctorModel
    field: MedicalFieldModel
    onSelect : (date : Date) => void
}

export function DateSelector({ doctor, field, onSelect } : DateSelectorProps){

    //ref to survives re-renders
    const unavailableSetRef = useRef<Set<string>>(new Set())
    const [loaded, setLoaded] = useState(false)


    useEffect(() => {
        loadUnavailableDates()
    }, [])

    async function loadUnavailableDates() {
        const dates = await AppointmentService.getUnavailableDates(doctor._id, field._id)
        if (dates) {
            const set = new Set<string>(dates.map(d => new Date(d).toISOString()))
            unavailableSetRef.current = set
        }
        setLoaded(true)
    }


    if (!loaded) return <h2>Loading...</h2>


    const someDate = new Date(2025, 7, 20, 15, 0, 0, 0)
    console.log(AppointmentService.getAvailableSlots(someDate, doctor, unavailableSetRef.current))

    return(
        <section className="date-selector">
            <h1>Date Selector</h1>
        </section>
    )
}