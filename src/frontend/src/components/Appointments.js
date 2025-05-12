import React, { useState, useEffect, useCallback } from 'react'
import {
    Stack,
    Box,
    Typography,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    Button,
    Rating,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4'
import CustomModal from 'components/CustomModal'
import { AppointmentDAO } from 'api/marketplaceDAO'
import { PaymentDAO } from 'api/paymentDAO'
import DailyIframe from '@daily-co/daily-js'
import { RefundInformation } from './HelperComponents'
import InfiniteScroll from 'react-infinite-scroller'


function ConfirmButton(props) {

    const [loading, setLoading] = useState(false)

    return <Button
        variant='contained'
        onClick={() => {
            setLoading(true)
            PaymentDAO.confirmPayment({
                appointmentId: props.appointment.id,
                onSuccess: (res) => {
                    props.onSuccess(res)
                    setLoading(false)
                },
                onFailure: (res) => {
                    props.onFailure(res)
                    setLoading(false)
                },
            })
        }}>
        {loading ? <CircularProgress color='inherit' /> : 'Confirm'}
    </Button>
}


function CancelButton(props) {

    const [buttonText, setButtonText] = useState(props.confirmed ? 'Refund' : 'Cancel')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setButtonText(props.confirmed ? 'Refund' : 'Cancel')
    }, [props.confirmed])

    return <>
        <RefundInformation />
        <Button
            variant='contained'
            color='error'
            onClick={() => {
                setLoading(true)
                PaymentDAO.cancelAppointment({
                    appointmentId: props.appointment.id,
                    onSuccess: (res) => {
                        props.onSuccess(res)
                        setLoading(false)
                    },
                    onFailure: (res) => {
                        props.onFailure(res)
                        setLoading(false)
                    },
                })
            }}
        >
            {loading ? <CircularProgress color='inherit' /> : buttonText}
        </Button>
    </>
}


function StartMeetingButton(props) {

    const [isLoading, setIsLoading] = useState(false)

    return <Button
        variant='contained'
        sx={{ ml: 2 }}
        onClick={() => {
            setIsLoading(true)
            AppointmentDAO.getAppointment({
                appointmentId: props.appointment.id,
                onSuccess: (res) => {
                    const callFrame = DailyIframe.createFrame({
                        iframeStyle: {
                            position: 'fixed',
                            border: '1px solid black',
                            width: '100%',
                            height: 'calc(100% - 20px)',
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
                            props.setOpenRating(true)
                        })
                    setIsLoading(false)
                    callFrame.join({
                        url: res.data.room_url,
                        token: res.data.token,
                    })
                },
                onFailure: (res) => {
                    props.onFailure(res)
                    setIsLoading(false)
                },
            })
        }}>
        {isLoading ? <CircularProgress color='inherit' /> : 'Start'}
    </Button>
}


function AppointmentButtons(props) {

    const [state, setState] = useState({
        openSnack: false,
        severity: 'success',
        alertMessage: ''
    })
    const [confirmed, setConfirmed] = useState(props.appointment.status === 'confirmed')
    const { openSnack, severity, alertMessage } = state

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setState({
            openSnack: false,
            severity: 'success',
            alertMessage: ''
        })
    }

    return <>
        {openSnack && <Snackbar
            open={openSnack}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>}
        <Stack
            direction='row'
            justifyContent='flex-end'
            alignItems='center'
            spacing={2}>
            {props.forTutor ? <>
                <CancelButton
                    confimed={confirmed}
                    appointment={props.appointment}
                    onSuccess={(mess) => {
                        setState({
                            openSnack: true,
                            severity: 'success',
                            alertMessage: mess
                        })
                        props.setCancelled(true)
                    }}
                    onFailure={(mess) => {
                        setState({
                            openSnack: true,
                            severity: 'error',
                            alertMessage: mess
                        })
                    }} />
                {confirmed ? <StartMeetingButton
                    appointment={props.appointment}
                    setOpenRating={props.setOpenRating}
                    onFailure={(mess) => {
                        setState({
                            openSnack: true,
                            severity: 'error',
                            alertMessage: mess
                        })
                    }}
                /> : <ConfirmButton
                    appointment={props.appointment}
                    onSuccess={() => setConfirmed(true)}
                    onFailure={(mess) => {
                        setState({
                            openSnack: true,
                            severity: 'error',
                            alertMessage: mess
                        })
                    }} />}
            </> : (
                confirmed ? <StartMeetingButton
                    appointment={props.appointment}
                    setOpenRating={props.setOpenRating}
                    onFailure={(mess) => {
                        setState({
                            openSnack: true,
                            severity: 'error',
                            alertMessage: mess
                        })
                    }} /> : <CancelButton
                    confimed={confirmed}
                    appointment={props.appointment}
                    onSuccess={(mess) => {
                        setState({
                            openSnack: true,
                            severity: 'success',
                            alertMessage: mess
                        })
                        props.setCancelled(true)
                    }}
                    onFailure={(mess) => {
                        setState({
                            openSnack: true,
                            severity: 'error',
                            alertMessage: mess
                        })
                    }} />
            )}
        </Stack>
    </>

}


function RatingView(props) {
    const [value, setValue] = React.useState(5);
    const [state, setState] = useState({
        openSnack: false,
        severity: 'success',
        alertMessage: ''
    })

    const { openSnack, severity, alertMessage } = state

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setState({
            openSnack: false,
            severity: 'success',
            alertMessage: ''
        })
    }
    return <CustomModal open={props.open} onClose={props.onClose}>
        {openSnack && <Snackbar
            open={openSnack}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>}
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
            <Button variant='contained'
                onClick={() => {
                    AppointmentDAO.rateAppointment({
                        appointmentId: props.appointment.id,
                        rating: value,
                        onSuccess: (mess) => {
                            props.rated(value)
                            setState({
                                openSnack: true,
                                severity: 'success',
                                alertMessage: mess
                            })
                            setTimeout(() => props.onClose(), 1000)
                        },
                        onFailure: (mess) => {
                            setState({
                                openSnack: true,
                                severity: 'error',
                                alertMessage: mess
                            })

                        }
                    })
                }}
            >
                Submit
            </Button>
        </Stack>
    </CustomModal>
}


function RatingButton(props) {

    const [openRating, setOpenRating] = useState(false)
    const [rating, setRating] = useState(props.appointment.rating)
    const [isRated, setIsRated] = useState(props.appointment.rating !== null)

    const rated = (value) => {
        setRating(value)
        setIsRated(true)
    }

    return <>
        {openRating && <RatingView
            open={openRating}
            rated={rated}
            appointment={props.appointment}
            onClose={() => setOpenRating(false)}
        />}
        <Box sx={{ textAlign: 'right' }}>
            {isRated ? <Rating
                size='large'
                value={rating}
                readOnly
            /> : <Button
                variant='contained'
                onClick={() => setOpenRating(true)}
            >
                Rate Appointment
            </Button>}
        </Box>
    </>
}


export function Appointment(props) {

    const [cancelled, setCancelled] = useState(false)
    const [openRating, setOpenRating] = useState(false)

    const appointment = props.appointment
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    var username = null
    if (props.forTutor) {
        username = appointment.tutee.username
    } else {
        username = appointment.tutor.first_name.concat(' ', appointment.tutor.last_name)
    }

    const date = new Date(appointment.date_time)
    const duration = appointment.duration

    return <>
        {openRating && !props.forTutor && <RatingView
            open={openRating && !props.forTutor}
            rated={() => { }}
            appointment={props.appointment}
            onClose={() => setOpenRating(false)}
        />}
        {cancelled ? null : <Accordion sx={{ width: '100%' }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Grid
                    container sx={{ width: '100%' }}
                    justifyContent='space-between'
                    alignItems='flex-end'
                >
                    <Grid item xs={6}>
                        <Typography>
                            With {username} {props.appointment.cost && `- $${(props.appointment.cost / 100).toFixed(2)}`}
                        </Typography>

                    </Grid>
                    <Grid item xs={6} >
                        <Typography sx={{ color: 'text.secondary' }} align='right'>
                            {date.toLocaleString('en-US', options)} - {duration} min
                        </Typography>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Stack>
                    <Typography>
                        {appointment.message}
                    </Typography>
                    {props.past ? (!props.forTutor && <RatingButton appointment={appointment} />) : <AppointmentButtons
                        appointment={appointment}
                        username={username}
                        forTutor={props.forTutor}
                        setOpenRating={setOpenRating}
                        setCancelled={setCancelled} />}
                </Stack>
            </AccordionDetails>
        </Accordion>}
    </>
}


function BadConnection(props) {
    return <Stack
        justifyContent='center'
        alignItems='center'>
        <SignalWifiStatusbarConnectedNoInternet4Icon
            color='disabled'
            sx={{ height: 50, width: 50 }} />
        <Typography variant='h6' color='gray'>
            Oops something went wrong!
        </Typography>
    </Stack>
}


export function AppointmentsList(props) {

    const [appointments, setAppointments] = useState([])
    // const [totalPages, setTotalPages] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)
    const [connectionOk, setConnectionOk] = useState(true)

    var date = new Date()
    date.setHours(date.getHours() - 1)

    const fetchData = () => {

        if (!props.expanded) return

        AppointmentDAO.getAllAppointments({
            user_id: props.user.id,
            isTutor: props.forTutor,
            future: !props.past,
            date: date,
            page: page,
            onSuccess: (res) => {
                setHasMore(res.total_pages > page)
                setAppointments([...appointments, ...res.results])
                setConnectionOk(true)
                setPage(page + 1)
            },
            onFailure: () => {
                setConnectionOk(false)
            }
        })
    }

    return (
        <Accordion expanded={props.expanded} onChange={props.handleChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1bh-content'>
                <Typography variant='h6'>
                    {props.title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails
                sx={{ maxHeight: 250, overflow: 'auto' }}>
                {connectionOk ? <InfiniteScroll
                    key={props.panel}
                    pageStart={0}
                    loadMore={fetchData}
                    hasMore={hasMore}
                    useWindow={false}
                    loader={<CircularProgress key={0} />}
                >
                    {appointments.map((appointment) => {
                        return <Appointment
                            key={appointment.id}
                            appointment={appointment}
                            forTutor={props.forTutor}
                            past={props.past}
                        />
                    })}
                </InfiniteScroll> : <BadConnection />}
            </AccordionDetails>
        </Accordion >
    )
}


export default function Appointments(props) {

    const [expanded, setExpanded] = useState('panel1')

    const user = props.user
    const tutor = user ? user.tutor : null

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    const renderTuteeAppointments = () => {
        return (
            <Stack sx={{ mb: 1, mt: 1 }}>
                <AppointmentsList
                    panel='panel1'
                    expanded={expanded === 'panel1'}
                    user={user}
                    forTutor={false}
                    past={false}
                    handleChange={handleChange('panel1')}
                    title='Upcoming Appointments'
                />
                <AppointmentsList
                    panel='panel2'
                    expanded={expanded === 'panel2'}
                    user={user}
                    forTutor={false}
                    past={true}
                    handleChange={handleChange('panel2')}
                    title='Past Appointments'
                />
            </Stack>
        )
    }

    const renderTutorAppointments = () => {
        return (
            <Stack sx={{ mb: 1, mt: 1 }}>
                <AppointmentsList
                    panel='panel3'
                    expanded={expanded === 'panel3'}
                    user={user}
                    forTutor={true}
                    past={false}
                    handleChange={handleChange('panel3')}
                    title='Upcoming Appointments'
                />
                <AppointmentsList
                    panel='panel4'
                    expanded={expanded === 'panel4'}
                    user={user}
                    forTutor={true}
                    past={true}
                    handleChange={handleChange('panel4')}
                    title='Past Appointments'
                />
            </Stack>
        )
    }

    return <Stack >
        {user && <Box>
            <Typography variant='h5'>
                As a Tutee
            </Typography>
            {renderTuteeAppointments()}
        </Box>}
        {tutor && <Box>
            <Typography variant='h5'>
                As a Tutor
            </Typography>
            {renderTutorAppointments()}
        </Box>}
    </Stack>
}