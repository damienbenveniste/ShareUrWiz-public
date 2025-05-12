import React from 'react'
import {
    Typography,
    Stack,
} from '@mui/material'


export default function ConfirmAppointment(props) {

    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    var localDate = new Date(props.appointment['date_time'])
    const date = localDate.toLocaleDateString('en-US', options)
    const hour = localDate.toLocaleTimeString('en-US')
    const duration = props.appointment.duration

    return (
        <Stack>
            <Typography variant='h5'>
                Book Appointment
            </Typography>
            <Typography variant='h6'>
                With {props.profile.first_name} {props.profile.last_name}
            </Typography>
            <Typography>
                On {date} at {hour} for a duration of {duration} min with a final amount of ${props.amount}
            </Typography>
        </Stack>

    )
}