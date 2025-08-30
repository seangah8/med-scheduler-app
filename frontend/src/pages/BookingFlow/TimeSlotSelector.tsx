import { useState, useEffect, useRef } from "react"
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { format } from 'date-fns'
import { DoctorModel } from "@/models/doctor.model"
import { MedicalFieldModel } from "@/models/medicalField.model"
import { AppointmentService } from "../../services/appointment.service"
import { TimeSlotService } from "../../services/timeSlot.service"
import { LoadingSpinner } from "../../components/LoadingSpinner"


interface TimeSlotSelectorProps {
  field: MedicalFieldModel
  doctor: DoctorModel
  selectedDate: Date | null
  onSelect: (date: Date) => void
}

export function TimeSlotSelector({ field, doctor, selectedDate, onSelect }: TimeSlotSelectorProps) {
  const unavailableDaysSetRef = useRef<Set<string>>(new Set())
  const unavailableSlotsSetRef = useRef<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date())
  const [availableDaySlots, setAvailableDaySlots] = useState<Date[]>([])

  useEffect(() => {
    loadUnavailabilities()
  }, [])

  useEffect(() => {
    if (calendarDate && !isLoading) {
      
      const slots = TimeSlotService.getAvailableSlots(
        calendarDate,
        doctor,
        unavailableSlotsSetRef.current
      )
      setAvailableDaySlots(slots)
    }
  }, [calendarDate, isLoading])

  async function loadUnavailabilities() {
    const result = await AppointmentService.getAllUnavailabilities(field._id, doctor._id)
    if (result) {
      const { unavailableDays, unavailableSlots } = result
      const daysSet = new Set<string>(unavailableDays)
      const slotsSet = new Set<string>(unavailableSlots.map(d => new Date(d).toISOString()))
      unavailableDaysSetRef.current = daysSet
      unavailableSlotsSetRef.current = slotsSet

      // check if today is not already in unavailableDaysSet
      const now = new Date()
      const todayStr = format(now, 'yyyy-MM-dd')
      if (!daysSet.has(todayStr)) {
        const potentialTodaySlots = TimeSlotService.getAvailableSlots(now, doctor, slotsSet)
        const futureTodaySlots = potentialTodaySlots.filter(slot => slot > now)


        if (futureTodaySlots.length === 0) {
          daysSet.add(todayStr)
        }
      }
    }

    const firstAvailable = TimeSlotService.findFirstAvailableDate(
      doctor, field._id, unavailableDaysSetRef.current)

    if (firstAvailable) {
      setCalendarDate(firstAvailable)
    }

    setIsLoading(false)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <section className="time-slot-selector">
      <h1>Select Time With {doctor.name}</h1>

      <div className="time-select-area">

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateCalendar
            views={['day']}
            value={calendarDate}
            onChange={(newDate) => {
              if (!newDate) return
              const dateStr = format(newDate, 'yyyy-MM-dd')
              if (!unavailableDaysSetRef.current.has(dateStr)) {
                setCalendarDate(new Date(newDate))
              }
            }}
            shouldDisableDate={(date) => TimeSlotService.isDayDisable
              (date, field._id, doctor, unavailableDaysSetRef.current)}
          />
        </LocalizationProvider>

        <ul>
          {
            availableDaySlots.map(d =>
              <li key={d.toISOString()} 
              className={selectedDate === d ? 'selected-date' : ''}
              onClick={() => onSelect(d)}>
                {TimeSlotService.formatTimeShort(d)}
              </li>
            )
          }
        </ul>

      </div>


    </section>
  )
}
