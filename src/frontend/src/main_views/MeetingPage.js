
import React, { useEffect, useState } from 'react'
import { AppointmentDAO } from 'api/marketplaceDAO'
import {
    Stack,
    Typography,
    Rating,
    CircularProgress,
} from '@mui/material'
import DailyIframe from '@daily-co/daily-js'
import { RateAppointmentButton } from 'api/componentWrappers/Buttons'
import CustomModal from 'components/CustomModal'


function RatingView(props) {

    const [value, setValue] = useState(5)

    return <CustomModal open={props.open} onClose={props.onClose}>
        <Stack>
            <Typography>
                Please rate this Appointment
            </Typography>
            <Rating
                size='large'
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            />
            <RateAppointmentButton
                variant='contained'
                rating={value}
                appointmentId={props.appointmentId}
                onSuccess={() => {
                    setTimeout(props.onClose, 1000)
                }}
            />
        </Stack>
    </CustomModal>
}

export default function MeetingPage(props) {

    const [isLoading, setIsLoading] = useState(false)
    const [openRating, setOpenRating] = useState(false)
    const appointmentId = JSON.parse(localStorage.getItem('appointmentId'))

    useEffect(() => {
        setIsLoading(true)
        AppointmentDAO.getAppointment({
            appointmentId: appointmentId,
            onSuccess: (res) => {
                setIsLoading(false)
                const callFrame = DailyIframe.createFrame({
                    iframeStyle: {
                        position: 'fixed',
                        border: '1px solid black',
                        width: '100%',
                        height: '100%',
                        right: '0em',
                        bottom: '0em',
                    },
                    showLeaveButton: true,
                    showFullscreenButton: true,
                    userName: props.username
                })
                callFrame
                    .on('left-meeting', (event) => {
                        callFrame.destroy()
                        setOpenRating(true)
                    })
                callFrame.join({
                    url: res.data.room_url,
                    token: res.data.token,
                })
            },
            onFailure: (res) => {
                setIsLoading(false)
                window.open('', '_self')
                window.close()
            },
        })

    }, [])


    return <>
        {openRating && <RatingView
            appointmentId={appointmentId}
            open={openRating}
            onClose={() => {
                setOpenRating(false)
                window.open('', '_self')
                window.close()
            }}
        />}
        {isLoading && <CircularProgress />}
    </>

}