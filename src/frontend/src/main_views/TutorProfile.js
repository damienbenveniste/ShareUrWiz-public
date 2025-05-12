
import React, { Component, useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import {
    Stack,
    Grid,
    Container,
    Avatar,
    Paper,
    Box,
    Button,
    Typography,
    TextField,
    BottomNavigation,
    BottomNavigationAction,
    Skeleton,
    CircularProgress,
    Badge,
    Rating,
    Link
} from '@mui/material'
import {
    LocalizationProvider,
    StaticDatePicker
} from '@mui/lab'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import PersonIcon from '@mui/icons-material/Person'
import Constant from 'utils/constants'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import ForumIcon from '@mui/icons-material/Forum'
import { TutorProfileDAO } from 'api/marketplaceDAO'
import PickersDay from '@mui/lab/PickersDay'
import ConfirmAppointmentContainer from 'modals/payment/ConfirmAppointmentContainer'
import Messaging from 'main_views/chat/Messaging'
import IconButton from '@mui/material/IconButton'
import {
    PermContactCalendar,
    Schedule,
} from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { Auth } from 'modals/login/firebase_auth'
import { warningColor } from 'assets/jss/material-kit-react.js'
import moment from 'moment'
import LoginContainer from 'modals/login/LoginContainer'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useAuthState } from 'react-firebase-hooks/auth'
import OtherLinks from 'main_views/OtherLinks'
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4';



function MessageBox(props) {

    return (
        props.profile && props.user && <Stack
            sx={{ display: '', height: '100%' }}
            spacing={2}>
            <IconButton
                onClick={props.closeMessaging}
            >
                <CloseIcon />
            </IconButton>
            <Typography align='center' variant='h5'>
                {props.profile.first_name} {props.profile.last_name}
            </Typography>
            <Messaging
                connection={props.profile}
                userId={props.user.uid}
            />
        </Stack >
    )
}


function TutorProfileCard(props) {
    return (
        <Stack
            justifyContent='center'
            alignItems='center'
            sx={{ padding: 3, overflow: 'auto', pb: { xs: 9, md: 3 } }}
            spacing={2}>
            <Avatar
                src={props.profile.picture}
                srcSet={`${props.profile.picture}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={props.profile.first_name}
                sx={{ width: 150, height: 150 }}>
                <PersonIcon sx={{ width: 150, height: 150 }} />
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, float: 'right', verticalAlign: 'middle' }}>
                {props.profile.linkedin_url &&
                    <Link href={props.profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <IconButton size='large'>
                            <LinkedInIcon color='primary' fontSize='large' />
                        </IconButton>
                    </Link>}
                <Typography align='center' variant='h5'>
                    {props.profile.first_name} {props.profile.last_name}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, float: 'right', verticalAlign: 'middle' }}>
                <Typography sx={{ mr: 1 }} >
                    {props.profile.rating.toFixed(1)}
                </Typography>
                <Rating
                    value={props.profile.rating}
                    precision={0.1}
                    readOnly />
                <Typography sx={{ ml: 1 }} >
                    {props.profile.num_rating}
                </Typography>
            </Box>
            <Typography align='center' variant='h6'>
                ${props.profile.price} / hr
            </Typography>
            <Typography align='center'>
                Specialties: {props.profile.specialties.join(' - ')}
            </Typography>
            <Typography variant='h5' align='left' sx={{ display: { xs: '', md: 'none' }, whiteSpace: 'pre-line' }}>
                Summary
            </Typography>
            <Typography align='left' sx={{ display: { xs: '', md: 'none' } }}>
                {props.profile.summary}
            </Typography>
            <Button
                sx={{ display: { xs: 'none', md: 'flex' } }}
                variant='contained'
                startIcon={<ForumIcon />}
                onClick={props.openMessaging}
            >
                Chat
            </Button>
        </Stack>
    )
}


function SkeletonCard() {
    return <Stack
        spacing={1}
        sx={{ width: '100%', pt: 3 }}
        justifyContent='center'
        alignItems='center'>
        <Skeleton variant='circular' width={150} height={150} />
        <Skeleton variant='text' width='90%' />
        <Skeleton variant='rectangular' width='90%' height={300} />
    </Stack>
}


function ProfileCard(props) {

    const [messagingOpen, setMessagingOpen] = useState(false)
    const [ user ] = useAuthState(Auth.auth())

    if (messagingOpen) {
        return <MessageBox
            user={user}
            profile={props.profile}
            closeMessaging={() => setMessagingOpen(false)} />
    } else if (!props.profile) {
        return <SkeletonCard />
    } else {
        return <TutorProfileCard
            profile={props.profile}
            openMessaging={() => {
                if (user) {
                    setMessagingOpen(true)
                } else {
                    props.openLogin()
                }
            }} />
    }
}


function CalendarDay(props) {

    const day = props.day
    const appointments = props.appointments
    const DayComponentProps = props.DayComponentProps
    const [aptNumber, setAptNumber] = useState(null)

    useEffect(() => {
        if (day in appointments && !DayComponentProps.outsideCurrentMonth) {
            setAptNumber(appointments[day].length)
        }
    }, [appointments])

    return (
        <Badge
            badgeContent={aptNumber}
            color='warning'
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <PickersDay
                {...DayComponentProps}
                disabled={aptNumber ? false : true}
                today={aptNumber ? true : false}
            />
        </Badge>
    )
}


function BadConnection(props) {
    return <Stack
        sx={{ position: 'fixed', zIndex: 10 }}
        justifyContent="center"
        alignItems="center">
        <SignalWifiStatusbarConnectedNoInternet4Icon
            color='disabled'
            sx={{ height: 50, width: 50 }} />
        <Typography variant='h6' color='gray'>
            Oops something went wrong!
        </Typography>
    </Stack>
}


function Calendar(props) {

    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('md'))
    const [calendarValue, setCalendarValue] = useState(null)
    const [loading, setLoading] = useState(false)
    const [appointments, setAppointments] = useState([])
    const [connectionOk, setConnectionOk] = useState(true)


    const getDateDictionary = (apts) => {

        return apts.reduce(function (dateDict, apt) {
            var localDate = new Date(apt['date_time'])
            localDate.setHours(0, 0, 0, 0)
            if (localDate in dateDict) {
                dateDict[localDate].push(apt)
            } else {
                dateDict[localDate] = [apt]
            }
            return dateDict
        }, {})
    }

    useEffect(() => {
        if (props.profile) {
            setLoading(true)
            TutorProfileDAO.getAvailableAppointments({
                profile: props.profile,
                date: new Date(),
                onSuccess: ((res) => {
                    const apts = getDateDictionary(res)
                    setAppointments(apts)
                    var firstDate = new Date(Math.min.apply(null, Object.keys(apts).map((date) => new Date(date.valueOf()))))
                    firstDate.setHours(0, 0, 0, 0)
                    setCalendarValue(firstDate)
                    setConnectionOk(true)
                    setLoading(false)
                }),
                onFailure: (mess) => {
                    setConnectionOk(false)
                    setLoading(false)
                }
            })
        }
    }, [])

    useEffect(() => {
        if (props.profile) {
            setLoading(true)
            TutorProfileDAO.getAvailableAppointments({
                profile: props.profile,
                date: new Date(),
                onSuccess: ((res) => {
                    const apts = getDateDictionary(res)
                    setAppointments(apts)
                    var firstDate = new Date(Math.min.apply(null, Object.keys(apts).map((date) => new Date(date.valueOf()))))
                    firstDate.setHours(0, 0, 0, 0)
                    setCalendarValue(firstDate)
                    setConnectionOk(true)
                    setLoading(false)
                }),
                onFailure: (mess) => {
                    setConnectionOk(false)
                    setLoading(false)
                }
            })
        }
    }, [props.profile, props.reload])


    return (
        <Box sx={{ height: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Paper>
                    <Stack justifyContent="center"
                        alignItems="center">
                        {loading && <CircularProgress sx={{ position: 'fixed', zIndex: 10 }} />}
                        {!connectionOk && <BadConnection style={{ position: 'absolute', zIndex: 10 }} />}
                        <StaticDatePicker
                            openTo='day'
                            displayStaticWrapperAs={mobile ? 'mobile' : 'desktop'}
                            value={calendarValue}
                            renderInput={(params) => <TextField {...params} />}
                            onChange={(newValue) => {
                                newValue.setHours(0, 0, 0, 0)
                                setCalendarValue(newValue)
                            }}
                            renderDay={(day, _value, DayComponentProps) => {

                                return <CalendarDay
                                    key={day}
                                    day={day}
                                    appointments={appointments}
                                    DayComponentProps={DayComponentProps} />
                            }}
                        />
                    </Stack>
                </Paper>
            </LocalizationProvider>
            <Typography variant='h5' sx={{ mt: 2, mb: 2 }} >
                Available Appointments
            </Typography>

            {calendarValue && (calendarValue in appointments) && <Container
                sx={{ heigh: '100%' }}>

                {appointments[calendarValue].map((apt) => {

                    var localDate = new Date(apt['date_time'])
                    const time = moment(
                        localDate.getHours().toString() + ':' + localDate.getMinutes().toString(),
                        'HH:mm'
                    )
                    const duration = apt.duration

                    return (
                        <Button
                            value={time}
                            key={time}
                            variant='contained'
                            sx={{ width: 120, margin: 0.5 }}
                            onClick={() => props.onAptButtonClick(apt)}>
                            <Stack>
                                <Typography variant='button'>
                                    {time.format('LT')}
                                </Typography>
                                <Typography variant='caption' align='right'>
                                    {duration} min
                                </Typography>
                            </Stack>
                        </Button>
                    )
                })}
            </Container>}
        </Box >
    )
}


function Summary(props) {

    const [noWrap, setNoWrap] = useState(true)
    const [summaryButtonText, setSummaryButtonText] = useState('More')

    const onClick = () => {
        const text = noWrap ? 'Less' : 'More'
        setNoWrap(!noWrap)
        setSummaryButtonText(text)
    }

    if (!props.profile) {
        return <Skeleton variant='rectangular' width='100%' height={200} />
    } else {
        return <Paper sx={{ padding: 3 }}>
            <Typography variant='h5' align='left' sx={{ mb: 2 }}>
                Summary
            </Typography>
            {noWrap? <Typography noWrap={true}>
                {props.profile.summary}
            </Typography> : <Typography noWrap={false} sx={{ whiteSpace: 'pre-line'}}>
                {props.profile.summary}
            </Typography> }
            <Button
                onClick={onClick}
            >
                {summaryButtonText}
            </Button>
        </Paper>
    }
}


class TutorProfile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            confirmAppointmentOpen: false,
            selectedAppointment: null,
            activeTab: 0,
            profile: null,
            loginOpen: false,
            user: null
        }

        this.handleConfirmAppointmentClose = this.handleConfirmAppointmentClose.bind(this)
        this.handleLoginClose = this.handleLoginClose.bind(this)
        this.onAptButtonClick = this.onAptButtonClick.bind(this)

        Auth.auth().onAuthStateChanged((user) => this.state.user = user)
    }

    handleConfirmAppointmentClose() {
        this.setState({
            selectedAppointment: null,
            confirmAppointmentOpen: false
        })
    }

    componentDidMount() {
        const profileId = this.props.match.params.profileId
        TutorProfileDAO.getProfile(
            profileId,
            (res) => this.setState({ profile: res.data }),
            () => this.props.history.replace(Constant.URL.ROOT)
        )
    }

    onAptButtonClick(apt) {
        Auth.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    confirmAppointmentOpen: true,
                    selectedAppointment: apt,
                    user: user
                })
            } else {
                this.setState({ loginOpen: true })
            }
        })
    }

    renderProfile() {
        return <Grid container spacing={2} columns={12} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Grid item xs={3}>
                <Paper sx={{ height: '90vh' }}>
                    <ProfileCard
                        profile={this.state.profile}
                        openLogin={() => this.setState({ loginOpen: true })}
                    />
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Stack spacing={2} sx={{ height: '90vh', overflow: 'auto' }}>
                    <Summary profile={this.state.profile} />
                    <Calendar
                        profile={this.state.profile}
                        onAptButtonClick={this.onAptButtonClick} />
                </Stack>
            </Grid>
            <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                <OtherLinks />
            </Grid>
        </Grid>
    }

    renderMobileProfile() {
        return (
            <Box sx={{ pb: 9, display: { xs: '', md: 'none' }, height: '100%' }}>
                {(this.state.activeTab === 0) && <ProfileCard
                    profile={this.state.profile}
                    openLogin={() => this.setState({ loginOpen: true })}
                />}
                {(this.state.activeTab === 1) && <Calendar
                    profile={this.state.profile}
                    onAptButtonClick={this.onAptButtonClick} />}
                {(this.state.activeTab === 2) && this.state.profile && this.state.user && <Messaging
                    minHeight='75vh'
                    connection={this.state.profile}
                    userId={this.state.user.uid}
                />}
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={this.state.activeTab}
                        sx={{ background: warningColor }}
                        onChange={(e, active) => this.setState({ activeTab: active })}
                    >
                        <BottomNavigationAction label='Profile' icon={<PermContactCalendar />} sx={{ minWidth: '15px' }} />
                        <BottomNavigationAction label='Appointments' icon={<Schedule />} sx={{ minWidth: '15px' }} />
                        <BottomNavigationAction label='Chat' icon={<ForumIcon />} sx={{ minWidth: '15px' }} />
                    </BottomNavigation>
                </Paper>
            </Box>
        )
    }

    handleLoginClose() {
        this.setState({ loginOpen: false })
    }

    render() {
        return (
            <>
                {this.state.loginOpen && <LoginContainer
                    open={this.state.loginOpen}
                    onClose={this.handleLoginClose}
                />}
                {this.state.confirmAppointmentOpen && <ConfirmAppointmentContainer
                    open={this.state.confirmAppointmentOpen}
                    onClose={this.handleConfirmAppointmentClose}
                    appointment={this.state.selectedAppointment}
                    profile={this.state.profile}
                    snackbarOpen={this.state.snackbarOpen}
                    handleSuccess={this.handleSnackbarOpen}
                />}
                {this.renderMobileProfile()}
                {this.renderProfile()}
            </>
        )
    }


}

export default withRouter(TutorProfile)

