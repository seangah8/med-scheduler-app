import { Autocomplete, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { AppointmentFilterModel } from '@/models/appointment.model'
import '../../../styles/Dashboard/AppointmentFilter.scss'

interface AppointmentFilterProps {
  filter: AppointmentFilterModel
  medicalFieldMap: Record<string, string>
  setFilter: (updatedFilter: AppointmentFilterModel) => void
}

export function AppointmentFilter({ filter, medicalFieldMap, setFilter }: AppointmentFilterProps) {
  const fieldOptions = Object.entries(medicalFieldMap).map(([id, name]) => ({ id, name }))

  const selectedFieldOption = filter.medicalFieldId
    ? fieldOptions.find(opt => opt.id === filter.medicalFieldId) ?? null
    : null

  return (
    <section className="appointment-filter">
      <div className="button-area">
        <button onClick={() => setFilter({ ...filter, onPast: false })} disabled={!filter.onPast}>
          Upcoming Appointments
        </button>
        <button onClick={() => setFilter({ ...filter, onPast: true })} disabled={filter.onPast}>
          Previous Appointments
        </button>
      </div>
      <div className="exstra-filter">

        <Autocomplete
          className='auto-complete'
          options={fieldOptions}
          value={selectedFieldOption}
          getOptionLabel={option => option.name}
          renderInput={params => <TextField {...params} label="Select Medical Field" />}
          onChange={(_, value) => {
            setFilter({ ...filter, medicalFieldId: value ? value.id : null })
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className='date-picker-container' 
              style={{visibility: filter.onPast ? 'visible' : 'hidden'}}>
                <DatePicker
                    label="From"
                    format="dd/MM/yyyy"
                    value={filter.startDate}
                    maxDate={new Date()}
                    onChange={date => setFilter({ ...filter, startDate: date })}
                    slotProps={{ textField: { fullWidth: true } }}
                />
                {
                    filter.startDate && 
                    <i className="fa-solid fa-xmark" onClick={()=>
                        setFilter({ ...filter, startDate: null })}/>
                }
            </div>
            <div className='date-picker-container'
              style={{visibility: filter.onPast ? 'visible' : 'hidden'}}>
                <DatePicker
                    label="To"
                    format="dd/MM/yyyy"
                    value={filter.endDate}
                    maxDate={new Date()}
                    onChange={date => setFilter({ ...filter, endDate: date })}
                    slotProps={{ textField: { fullWidth: true } }}
                />
                {
                    filter.endDate && 
                    <i className="fa-solid fa-xmark" onClick={()=>
                        setFilter({ ...filter, endDate: null })}/>
                }
            </div>
        </LocalizationProvider>
        
      </div>
    </section>
  )
}
