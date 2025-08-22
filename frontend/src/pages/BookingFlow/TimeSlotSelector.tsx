import { useState, useRef, useEffect } from "react"
import { DoctorModel } from "@/models/doctor.model"
import { MedicalFieldModel } from "@/models/medicalField.model"
import { AppointmentService } from "../../services/appointment.service"

interface DateSelectorProps{
    doctor: DoctorModel
    field: MedicalFieldModel
    onSelect : (date : Date) => void
}

export function TimeSlotSelector({ doctor, field, onSelect } : DateSelectorProps){

    //ref to survives re-renders
    const unavailableDaysSetRef = useRef<Set<string>>(new Set())
    const unavailableSlotsSetRef = useRef<Set<string>>(new Set())
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [calendarDate, setCalendarDate] = useState<Date>(new Date())
    const [availableDaySlots, setAvailableDaySlots] = useState<Date[]>([])


    useEffect(() => {
        loadUnavailabilities()
    }, [])

    useEffect(() => {
        if (isLoaded) {
            const slots = AppointmentService.getAvailableSlots
                (calendarDate, doctor, unavailableSlotsSetRef.current)
            setAvailableDaySlots(slots)
        }
    }, [calendarDate, isLoaded])


    async function loadUnavailabilities() {
        const result = await AppointmentService.getAllUnavailabilities(field._id, doctor._id)
        if (result) {
            const { unavailableDays, unavailableSlots } = result
            const daysSet = new Set<string>(unavailableDays.map(d => new Date(d).toISOString()))
            const slotsSet = new Set<string>(unavailableSlots.map(d => new Date(d).toISOString()))
            unavailableDaysSetRef.current = daysSet
            unavailableSlotsSetRef.current = slotsSet
        }
        setIsLoaded(true)
    }

    if (!isLoaded) return <h2>Loading...</h2>

    return(
        <section className="time-slot-selector">
            <h1>Time Slot Selector</h1>
            <label htmlFor="date">Date:</label>
            <input
                id='date'
                type='date'
                value={calendarDate.toISOString().split('T')[0]}
                onChange={e => setCalendarDate(new Date(e.target.value))}
            />
            <ul>
                {
                    availableDaySlots.map(d => 
                        <li key={d.toISOString()}
                            onClick={()=>onSelect(d)}
                        >
                            {d.toISOString()}
                        </li>
                    )
                }
            </ul>
        </section>
    )
}