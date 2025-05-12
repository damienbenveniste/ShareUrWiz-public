import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  IconButton
} from '@mui/material'

import {
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import CloseIcon from '@mui/icons-material/Close';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { CreateAppointmentsButton } from 'api/componentWrappers/Buttons'


const dateFormat = 'MM/DD/YYYY hh:mm A'

const PREFIX = 'Demo';
const classes = {
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  closeButton: `${PREFIX}-closeButton`,
  buttonGroup: `${PREFIX}-buttonGroup`,
  button: `${PREFIX}-button`,
  picker: `${PREFIX}-picker`,
  wrapper: `${PREFIX}-wrapper`,
  icon: `${PREFIX}-icon`,
  textField: `${PREFIX}-textField`,
  addButton: `${PREFIX}-addButton`,
};

const StyledDiv = styled('div')(({ theme }) => ({
  [`& .${classes.icon}`]: {
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(2),
  },
  [`& .${classes.header}`]: {
    overflow: 'hidden',
    paddingTop: theme.spacing(0.5),
    width: '100%'
  },
  [`& .${classes.textField}`]: {
    width: '100%',
  },
  [`& .${classes.content}`]: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  [`& .${classes.closeButton}`]: {
    float: 'right',
  },
  [`& .${classes.picker}`]: {
    marginRight: theme.spacing(2),
    '&:last-child': {
      marginRight: 0,
    },
    width: '50%',
  },
  [`& .${classes.wrapper}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0),
  },
  [`& .${classes.buttonGroup}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
  },
  [`& .${classes.button}`]: {
    marginLeft: theme.spacing(2),
  },
}))

function WeekToggleButton({ disabled, setDay, day, ...restProps }) {

  const handleChange = (event, newDay) => {
    setDay(newDay);
  };

  return <ToggleButtonGroup
    color='primary'
    value={day}
    exclusive
    sx={{ width: '100%' }}
    onChange={handleChange}
  >
    <ToggleButton disabled={disabled} value={0}>MON</ToggleButton>
    <ToggleButton disabled={disabled} value={1}>TUE</ToggleButton>
    <ToggleButton disabled={disabled} value={2}>WED</ToggleButton>
    <ToggleButton disabled={disabled} value={3}>THU</ToggleButton>
    <ToggleButton disabled={disabled} value={4}>FRI</ToggleButton>
    <ToggleButton disabled={disabled} value={5}>SAT</ToggleButton>
    <ToggleButton disabled={disabled} value={6}>SUN</ToggleButton>
  </ToggleButtonGroup>
}


function FrequencyComponent({ disabled, setFrequencyRules, ...restProps }) {

  const [frequency, setFrequency] = useState('daily')
  const [day, setDay] = useState(0)
  const [interval, setInterval] = useState(1)
  const freqMap = {
    'daily': 'DAILY',
    'weekly': 'WEEKLY'
  }
  const dayMap = [
    'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'
  ]

  useEffect(() => {

    const rules = {
      FREQ: freqMap[frequency],
      INTERVAL: interval
    }
    if (frequency === 'weekly') {
      rules['BYDAY'] = dayMap[day]
    }

    setFrequencyRules(rules)

  }, [])

  useEffect(() => {

    const rules = {
      FREQ: freqMap[frequency],
      INTERVAL: interval
    }
    if (frequency === 'weekly') {
      rules['BYDAY'] = dayMap[day]
    }

    setFrequencyRules(rules)

  }, [frequency, day, interval])

  return <Stack spacing={3}>
    <FormControl fullWidth>
      <Select
        disabled={disabled}
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}>
        <MenuItem value='daily'>Daily</MenuItem>
        <MenuItem value='weekly'>Weekly </MenuItem>
      </Select>
    </FormControl>
    <Stack
      spacing={2}
      justifyContent='flex-start'
      alignItems='center'
      direction='row'
      sx={{ width: '100%' }}>
      <Typography sx={disabled && { color: 'gray' }}>Repeat every</Typography>
      <TextField
        disabled={disabled}
        value={interval}
        sx={{ width: 150 }}
        type='number'
        InputProps={{
          inputProps: { step: 1, min: 1 }
        }}
        onChange={e => setInterval(e.target.value)}
      />
      <Typography sx={disabled && { color: 'gray' }}>{frequency === 'daily' ? 'day(s)' : 'week(s) on'}</Typography>
    </Stack>
    {frequency === 'weekly' && <WeekToggleButton
      disabled={disabled}
      day={day}
      setDay={setDay} />}
  </Stack>
}


function RepeatRadio({ disabled, setEndingRules, ...restProps }) {

  const [value, setValue] = useState('on')
  const [untilDate, setUntilDate] = useState(new Date())
  const [occurence, setOccurence] = useState(1)

  useEffect(() => {

    const rules = {}

    if (value === 'on') {
      rules['COUNT'] = occurence
    } else {
      rules['UNTIL'] = untilDate
    }
    setEndingRules(rules)

  }, [])

  useEffect(() => {

    const rules = {}

    if (value === 'on') {
      rules['COUNT'] = occurence
    } else {
      rules['UNTIL'] = untilDate
    }
    setEndingRules(rules)

  }, [untilDate, occurence, value])


  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return <FormControl>
    <FormLabel>End repeat</FormLabel>
    <RadioGroup
      value={value}
      onChange={handleChange}>
      <Stack
        justifyContent='center'
        alignItems='flex-start'
        spacing={2}>
        <Stack
          spacing={2}
          justifyContent='flex-start'
          alignItems='center'
          direction='row'>
          <FormControlLabel disabled={disabled}
            value='on' control={<Radio />} label='On' />
          <TextField
            disabled={disabled}
            sx={{ width: 150 }}
            type='number'
            value={occurence}
            onChange={e => setOccurence(e.target.value)}
            InputProps={{
              inputProps: { step: 1, min: 1, max: 30 }
            }} />
          <Typography sx={disabled && { color: 'gray' }}>occurrence(s)</Typography>
        </Stack>
        <Stack
          spacing={2}
          justifyContent='flex-start'
          alignItems='center'
          direction='row'>
          <FormControlLabel disabled={disabled}
            value='after' control={<Radio />} label='After' />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              value={untilDate}
              disabled={disabled}
              renderInput={(props) => <TextField {...props} />}
              onChange={date => {
                setUntilDate(date)
              }}
              ampm={false}
              inputFormat={dateFormat}
              onError={() => null}
            />
          </LocalizationProvider>
        </Stack>
      </Stack>
    </RadioGroup>
  </FormControl>

}

function CustomRecurrentLayout({ disabled, setRepeatRules, ...restProps }) {

  const [frequencyRules, setFrequencyRules] = useState({})
  const [endingRules, setEndingRules] = useState({})

  useEffect(() => {

    const rules = {
      ...frequencyRules,
      ...endingRules
    }

    setRepeatRules(rules)

  }, [])

  useEffect(() => {

    const rules = {
      ...frequencyRules,
      ...endingRules
    }

    setRepeatRules(rules)

  }, [frequencyRules, endingRules])

  return <Stack spacing={3}>
    <Typography
      variant='h6'
      sx={disabled && { color: 'gray' }}
    ><b>Repeat</b></Typography>
    <FrequencyComponent
      disabled={disabled}
      setFrequencyRules={setFrequencyRules}
    />
    <RepeatRadio
      setEndingRules={setEndingRules}
      disabled={disabled}
    />
  </Stack>
}


function DateTimePickers({ pickerEditorProps, ...restProps }) {

  const startDatePickerProps = pickerEditorProps('startDate')
  const endDatePickerProps = pickerEditorProps('endDate')

  return <div className={classes.wrapper}>
    <CalendarToday className={classes.icon} color='action' />
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker
        label='Start Date'
        renderInput={
          props => <TextField className={classes.picker} {...props} />
        }
        {...startDatePickerProps}
      />
      <DateTimePicker
        label='End Date'
        renderInput={
          props => <TextField className={classes.picker} {...props} />
        }
        {...endDatePickerProps}
      />
    </LocalizationProvider>
  </div>

}


export default function AppointmentFormContainerBasic({
  appointmentData,
  onVisibilityChange,
  commitChanges,
  userId,
  ...restProps
}) {
  const [checked, setChecked] = useState(false)
  const [appointmentChanges, setAppointmentChanges] = useState({})
  const [repeatRules, setRepeatRules] = useState({})
  const [newAppointments, setNewAppointments] = useState([])
  const [valid, setValid] = useState(false)

  const displayAppointmentData = {
    ...appointmentData,
    ...appointmentChanges,
  }

  useEffect(() => {

    const appointment = {
      ...appointmentData,
    }
    const startDate = appointment.startDate
    const endDate = appointment.endDate

    const appointments = getAppointments()
    const isValid = (endDate.getTime() > startDate.getTime()) && (appointments.length > 0)
    setValid(isValid)
    if (isValid) {
      setNewAppointments(appointments)
    }

  }, [])

  useEffect(() => {

    const appointment = {
      ...appointmentData,
      ...appointmentChanges
    }
    const startDate = appointment.startDate
    const endDate = appointment.endDate

    const appointments = getAppointments()
    const isValid = (endDate.getTime() > startDate.getTime()) && (appointments.length > 0)
    setValid(isValid)
    if (isValid) {
      setNewAppointments(appointments)
    }

  }, [appointmentChanges, repeatRules, checked])

  const handleChange = (event) => {
    setChecked(event.target.checked)
  }

  const changeAppointment = ({ field, changes }) => {
    const nextChanges = {
      ...appointmentChanges,
      [field]: changes,
    }
    setAppointmentChanges(nextChanges)
  }

  const pickerEditorProps = field => ({
    value: displayAppointmentData[field],
    onChange: date => changeAppointment({
      field: [field],
      changes: date ? date.toDate() : new Date(displayAppointmentData[field]),
    }),
    ampm: false,
    inputFormat: dateFormat,
    onError: () => null,
  })

  const formatDate = (date) => {
    date = new Date(date).toISOString()
    return date.replace(/[: -]+/g, '').split('.')[0] + 'Z'
  }

  const getRulesStr = (rules) => {
    return 'RRULE:' + Object.entries(rules).map(([key, val]) => {
      return `${key}=${val}`
    }).join(';')
  }

  const applyChanges = () => {

    if ('UNTIL' in repeatRules) {
      repeatRules['UNTIL'] = formatDate(repeatRules['UNTIL'])
    }

    const repeatRulesStr = getRulesStr(repeatRules)

    const appointment = {
      ...appointmentData,
      ...appointmentChanges,
      ...(checked && { 'rRule': repeatRulesStr })
    }
    commitChanges({ ['added']: appointment })
  }

  const getNextDay = (day, startDate) => {
    const dayMap = {
      'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6
    }
    const dayVal = dayMap[day]
    const today = new Date()
    const nextDay = new Date()
    const diff = (dayVal - today.getDay() + 7) % 7
    nextDay.setDate(today.getDate() + diff)
    nextDay.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0)
    return new Date(nextDay)
  }

  const getAppointments = () => {

    const newAppointment = {
      ...appointmentData,
      ...appointmentChanges
    }

    const startDate = new Date(newAppointment.startDate)
    const endDate = new Date(newAppointment.endDate)
    const diff = endDate.getTime() - startDate.getTime()
    const duration = Math.round(diff / 60000)

    const appointments = []

    if (checked) {

      const currentDate = repeatRules.FREQ === 'DAILY' ? new Date(startDate) : getNextDay(repeatRules.BYDAY, startDate)
      const days = repeatRules.FREQ === 'DAILY' ? 1 : 7
      const interval = parseInt(repeatRules.INTERVAL)

      if ('UNTIL' in repeatRules) {
        const untilDate = new Date(repeatRules.UNTIL)
        while (currentDate.getTime() <= untilDate.getTime()) {
          const apt = {
            'tutor_id': userId,
            'tutee': null,
            'date_time': new Date(currentDate),
            'message': null,
            'room_url': null,
            'duration': duration
          }
          appointments.push(apt)
          currentDate.setDate(currentDate.getDate() + (days * interval))
        }
      } else {
        for (let i = 0; i < parseInt(repeatRules.COUNT); i++) {
          const apt = {
            'tutor_id': userId,
            'tutee': null,
            'date_time': new Date(currentDate),
            'message': null,
            'room_url': null,
            'duration': duration
          }
          appointments.push(apt)
          currentDate.setDate(currentDate.getDate() + (days * interval))
        }
      }

    } else {
      const apt = {
        'tutor_id': userId,
        'tutee': null,
        'date_time': startDate,
        'message': null,
        'room_url': null,
        'duration': duration
      }

      appointments.push(apt)
    }
    console.log(appointments)
    return appointments
  }

  return <AppointmentForm.Overlay
    {...restProps}
  >
    <StyledDiv>
      <div className={classes.header}>
        <IconButton
          className={classes.closeButton}
          size='large'
          onClick={onVisibilityChange}
        >
          <CloseIcon color='action' />
        </IconButton>
      </div>
      <Stack spacing={3} sx={{ mt: 3, margin: 3, maxWidth: '80vw' }}>
        <DateTimePickers
          pickerEditorProps={pickerEditorProps}
        />
        <FormGroup>
          <FormControlLabel control={
            <Checkbox
              checked={checked}
              onChange={handleChange} />
          } label='Repeat' />
        </FormGroup>
        <CustomRecurrentLayout
          setRepeatRules={setRepeatRules}
          disabled={!checked}
        />
        <div className={classes.buttonGroup}>
          <CreateAppointmentsButton
            disabled={!valid}
            variant='contained'
            appointments={newAppointments}
            className={classes.button}
            onSuccess={() => {
              onVisibilityChange()
              applyChanges()
            }} />
        </div>
      </Stack>
    </StyledDiv>

  </AppointmentForm.Overlay>

}
