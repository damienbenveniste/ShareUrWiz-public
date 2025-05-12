
import React, { Component, useState, useEffect } from 'react'
import {
    Paper,
    Typography,
    TextField,
    Grid,
    Button,
    Stack,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    InputAdornment,
    List,
    ListItem,
    Box,
    CircularProgress,
    Container,
    BottomNavigation,
    BottomNavigationAction,
    Snackbar,
    Alert,
    Chip,
    Backdrop
} from '@mui/material'
import { AppointmentDAO } from 'api/marketplaceDAO'
import FaceIcon from '@mui/icons-material/Face'
import EditIcon from '@mui/icons-material/Edit'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { warningColor } from 'assets/jss/material-kit-react'
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4';

import {
    LocalizationProvider,
    StaticDatePicker,
    DatePicker
} from '@mui/lab'
import moment from 'moment'
import AdapterDateFns from '@mui/lab/AdapterDateFns'


function MainCalendar(props) {
    return <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
            displayStaticWrapperAs='desktop'
            openTo='day'
            value={props.calendarValue}
            renderInput={(params) => <TextField {...params} />}
            onChange={(newValue) => {
                newValue.setHours(0, 0, 0, 0)
                props.setCalendarValue(newValue)
            }}
        />
    </LocalizationProvider>
}


function RecurringDropDown(props) {
    return <FormControl sx={{ width: '50%' }}>
        <InputLabel>Reccuring</InputLabel>
        <Select
            value={props.recurring}
            autoWidth
            label='Reccuring'
            onChange={(event) => {
                props.setRecurring(event.target.value)
            }}
        >
            <MenuItem value={'none'}>None</MenuItem>
            <MenuItem value={'daily'}>Daily</MenuItem>
            <MenuItem value={'weekly'}>Weekly</MenuItem>
        </Select>
    </FormControl>
}


function UntilDatePicker(props) {
    return <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
            label='Until'
            disabled={props.recurring === 'none'}
            sx={{ width: '50%' }}
            inputFormat='MM/dd/yyyy'
            value={props.untilDate}
            onChange={(newVal) => props.setUntilDate(newVal)}
            renderInput={(params) => <TextField {...params} />} />
    </LocalizationProvider>
}


function TimeButtons(props) {

    return <Container>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={props.loading}
        >
            <CircularProgress sx={{ position: 'fixed', zIndex: 10 }} color='inherit' />
        </Backdrop>
        {Array.from(Array(24).keys()).map((hour) => {

            const time = moment(
                hour.toString() + ':' + props.minutes.toString(),
                'HH:mm'
            )
            return <Button
                value={hour}
                key={hour}
                variant='contained'
                sx={{ width: '100px', margin: 0.5 }}
                onClick={() => {
                    props.createNewAppointments(hour)
                }}>
                <Stack>
                    <Typography variant='button'>
                        {time.format('LT')}
                    </Typography>
                    <Typography variant='caption' align='right'>
                        {props.time} min
                    </Typography>
                </Stack>
            </Button>
        })}
    </Container>
}


function Options(props) {

    const [calendarValue, setCalendarValue] = useState(new Date((new Date()).setHours(0, 0, 0, 0)))
    const [time, setTime] = useState(55)
    const [minutes, setMinutes] = useState(0)
    const [recurring, setRecurring] = useState('none')
    const [untilDate, setUntilDate] = useState(null)
    const [loading, setLoading] = useState(false)
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

    const createNewAppointments = (hour) => {

        const newAppointments = []
        var currentDate = new Date(calendarValue.valueOf())
        const lastDate = (recurring === 'none') ? calendarValue : untilDate
        const days = recurring === 'daily' ? 1 : 7
        while (currentDate <= lastDate) {
            var date_time = new Date(currentDate)
            date_time.setHours(hour, minutes)
            const apt = {
                'tutor_id': props.userId,
                'tutee': null,
                'date_time': date_time,
                'message': null,
                'room_url': null,
                'duration': time
            }
            newAppointments.push(apt)
            currentDate.setDate(currentDate.getDate() + days)
        }
        setLoading(true)
        AppointmentDAO.createAppointments({
            appointments: newAppointments,
            onSuccess: (res, mess) => {
                setState({
                    openSnack: true,
                    severity: 'success',
                    alertMessage: mess
                })
                setLoading(false)
                props.setNewAppointments(res)
            },
            onFailure: (mess) => {
                setLoading(false)
                setState({
                    openSnack: true,
                    severity: 'error',
                    alertMessage: mess
                })
            }
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
            spacing={1}
            justifyContent='center'
            alignItems='center'>
            <MainCalendar
                calendarValue={calendarValue}
                setCalendarValue={setCalendarValue} />

            <Stack spacing={1} direction='row' sx={{ width: '100%' }}>
                <TextField
                    label='Minute Start'
                    type='number'
                    variant='outlined'
                    sx={{ width: '50%' }}
                    value={minutes}
                    InputProps={{
                        endAdornment: <InputAdornment position='end'>min</InputAdornment>,
                        inputProps: { step: '5', max: 59, min: 0 }
                    }}
                    onChange={(event) => setMinutes(event.target.value)} />
                <TextField
                    label='Time'
                    type='number'
                    variant='outlined'
                    sx={{ width: '50%' }}
                    value={time}
                    InputProps={{
                        endAdornment: <InputAdornment position='end'>min</InputAdornment>,
                        inputProps: { step: '5', min: 10 }
                    }}
                    onChange={(event) => setTime(event.target.value)} />
            </Stack>
            <Stack
                sx={{ width: '100%' }}
                spacing={1}
                direction='row'
                justifyContent='center'
                alignItems='center'>
                <RecurringDropDown
                    recurring={recurring}
                    setRecurring={setRecurring} />
                <UntilDatePicker
                    untilDate={untilDate}
                    setUntilDate={setUntilDate} />
            </Stack>
            <TimeButtons
                minutes={minutes}
                time={time}
                loading={loading}
                createNewAppointments={createNewAppointments} />
        </Stack>
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


function AppointementList(props) {

    const [appointmentList, setAppointmentList] = useState({})
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [connectionOk, setConnectionOk] = useState(true)
    const [state, setState] = useState({
        openSnack: false,
        severity: 'success',
        alertMessage: ''
    })

    const { openSnack, severity, alertMessage } = state

    var observer = React.useRef(null)

    const getAppointmentList = (appointments, aptList) => {
        appointments.forEach(function (apt) {
            var date = new Date(apt.date_time)
            date.setHours(0, 0, 0, 0)
            if (date in aptList) {
                aptList[date][apt.id] = apt
            } else {
                aptList[date] = { [apt.id]: apt }
            }
        })
        return aptList
    }

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

    useEffect(() => {
        AppointmentDAO.getFutureAppointments({
            tutorId: props.userId,
            date: new Date(),
            page: page,
            onSuccess: ((res) => {
                const aptList = getAppointmentList(res.data.results, {})
                setAppointmentList(aptList)
                setTotalPages(res.data.total_pages)
                setLoading(false)
                setPage(page + 1)
                setConnectionOk(true)
            }),
            onFailure: () => {
                setConnectionOk(false)
            }
        })
    }, [])

    useEffect(() => {
        if (props.newAppointments.length !== 0) {
            const aptList = getAppointmentList(props.newAppointments, { ...appointmentList })
            setAppointmentList(aptList)
            props.emptyNewAppointments()
        }
    }, [props.newAppointments])

    const compateDates = (a, b) => {
        return new Date(a[0]) - new Date(b[0])
    }

    const compareApts = (a, b) => {
        const time1 = moment(new Date(a[1].date_time), 'LT')
        const time2 = moment(new Date(b[1].date_time), 'LT')
        return time1 - time2
    }

    const bottomPage = (node) => {
        if (loading || page >= totalPages) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {

                setLoading(true)
                if (page <= totalPages) {
                    AppointmentDAO.getFutureAppointments({
                        tutorId: props.userId,
                        date: new Date(),
                        page: page,
                        onSuccess: ((res) => {
                            const aptList = getAppointmentList(res.data.results, { ...appointmentList })
                            setAppointmentList(aptList)
                            setLoading(false)
                            setPage(page + 1)
                            setConnectionOk(true)
                        }),
                        onFailure: () => {
                            setConnectionOk(false)
                        }
                    })
                }
            }
        })
        if (node) observer.current.observe(node)
    }

    const deleteAppointment = (id, date) => {
        AppointmentDAO.deleteAppointment({
            appointmentId: id,
            onSuccess: (mess) => {
                const aptList = { ...appointmentList }
                delete aptList[date][id]
                if (Object.keys(aptList[date]).length === 0) {
                    delete aptList[date]
                }
                setAppointmentList(aptList)
                setState({
                    openSnack: true,
                    severity: 'success',
                    alertMessage: mess
                })
            },
            onFailure: (mess) => {
                setState({
                    openSnack: true,
                    severity: 'error',
                    alertMessage: mess
                })
            }
        })
    }

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return <>
        {openSnack && <Snackbar
            open={openSnack}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>}
        <Box sx={{ overflow: 'auto', height: '90vh'}}>
            {connectionOk ? <Stack
                justifyContent='center'
                alignItems='center'>
                <List >
                    {Object.entries(appointmentList).sort(compateDates).map(([dateStr, aptDict]) => {
                        const date = (new Date(dateStr)).toLocaleDateString('en-US', options)
                        return <ListItem key={dateStr}>
                            <Stack>
                                <Typography variant='h5'>{date}</Typography>
                                <Box>
                                    {Object.entries(aptDict).sort(compareApts).map(([id, apt]) => {
                                        const time = moment(apt.date_time).format('LT')
                                        if (apt.tutee) {
                                            return <Chip sx={{ margin: '1px' }}
                                                key={id}
                                                color='warning'
                                                label={`${time} - ${apt.duration} min - Booked`}
                                                icon={<FaceIcon />}
                                                variant='outlined'
                                            />
                                        } else {
                                            return <Chip sx={{ margin: '1px' }}
                                                key={id}
                                                color='primary'
                                                onDelete={() => { deleteAppointment(id, dateStr) }}
                                                label={`${time} - ${apt.duration} min`}
                                            />
                                        }

                                    })}
                                </Box>
                            </Stack>
                        </ListItem>
                    })}
                </List>
                {(Object.keys(appointmentList).length !== 0) && <div ref={bottomPage} />}
                {(loading && page <= totalPages) && <CircularProgress />}
                <div style={{ height: '20px' }} />
            </Stack> : <BadConnection />}
        </Box>
    </>
}


export default class SetAppointment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            newAppointments: [],
            activeTab: 0
        }
    }

    renderMobile() {
        return <Box sx={{ pb: 9, display: { xs: 'flex', md: 'none' }}}>
            {(this.state.activeTab === 0) && <Options
                userId={this.props.userId}
                setNewAppointments={(res) => this.setState({ newAppointments: res })} />}
            {(this.state.activeTab === 1) && <AppointementList
                userId={this.props.userId}
                newAppointments={this.state.newAppointments}
                emptyNewAppointments={() => this.setState({ newAppointments: [] })} />}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={this.state.activeTab}
                    sx={{ background: warningColor }}
                    onChange={(e, active) => this.setState({ activeTab: active })}
                >
                    <BottomNavigationAction label='Set Options' icon={<EditIcon />} sx={{ minWidth: '15px' }} />
                    <BottomNavigationAction label='Upcoming' icon={<ScheduleIcon />} sx={{ minWidth: '15px' }} />
                </BottomNavigation>
            </Paper>
        </Box>

    }

    renderDesktop() {
        return (
            <Grid container spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Grid item xs={6}>
                    <Options
                        userId={this.props.userId}
                        setNewAppointments={(res) => this.setState({ newAppointments: res })} />
                </Grid>
                <Grid item xs={6}>
                    <AppointementList
                        userId={this.props.userId}
                        newAppointments={this.state.newAppointments}
                        emptyNewAppointments={() => this.setState({ newAppointments: [] })} />
                </Grid>
            </Grid>
        )
    }

    render() {
        return (
            <>
                {this.renderDesktop()}
                {this.renderMobile()}
            </>
        )
    }
}