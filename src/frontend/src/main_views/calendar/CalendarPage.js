
import React, { Component, useState, useEffect } from 'react'
import {
    Grid,
    Paper,
    Tab,
    Box,
    CircularProgress,
    Typography,
    Stack,
    Rating,
    Button,
    LinearProgress,
    FormControl,
    Select,
    MenuItem,
    Fab,
    BottomNavigation,
    BottomNavigationAction,
    IconButton,
} from '@mui/material'

import AppointmentFormContainerBasic from 'main_views/calendar/AppointmentFormContainerBasic'
import { FutureAppointments } from 'api/componentWrappers/Scrollers'
import ScheduleIcon from '@mui/icons-material/Schedule'
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors'
import CloseIcon from '@mui/icons-material/Close'
import ForumIcon from '@mui/icons-material/Forum'
import { useHistory } from 'react-router-dom'
import {
    warningColor,
} from 'assets/jss/material-kit-react.js'

import {
    RateAppointmentButton,
    ConfirmAppointmentButton
} from 'api/componentWrappers/Buttons'
import { RefundInformation } from 'components/HelperComponents'

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import RecommendIcon from '@mui/icons-material/Recommend'
import AddIcon from '@mui/icons-material/Add'
import StarsIcon from '@mui/icons-material/Stars'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'
import {
    ViewState,
    IntegratedEditing,
    EditingState,
} from '@devexpress/dx-react-scheduler'
import {
    Scheduler,
    WeekView,
    Appointments,
    Toolbar,
    AppointmentTooltip,
    AppointmentForm,
    DateNavigator,
    TodayButton,
    ConfirmationDialog,
    CurrentTimeIndicator,
    Resources,
} from '@devexpress/dx-react-scheduler-material-ui'
import { connectProps } from '@devexpress/dx-react-core'
import { AppointmentDAO, UserDAO } from 'api/marketplaceDAO'
import { PaymentDAO } from 'api/paymentDAO'
import { Auth } from 'modals/login/firebase_auth'
import { green, blue, red, grey } from '@mui/material/colors'
import { Link } from 'react-router-dom'
import Constant from 'utils/constants'
import TodayIcon from '@mui/icons-material/Today'
import Messaging from 'main_views/chat/Messaging'
import { NoteDAO } from 'api/noteDAO'


function RatingView(props) {
    const rating = props.rating ? props.rating : 5
    const [value, setValue] = useState(rating)

    return <Grid container alignItems="center" sx={{ pt: 2, pb: 2 }}>
        <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <StarsIcon color='disabled' />
        </Grid>
        <Grid item xs={7} sx={{ textAlign: 'center' }}>
            <Rating
                size='large'
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            />
        </Grid>
        <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <RateAppointmentButton
                rating={value}
                appointmentId={props.appointmentId}
                onSuccess={() => {
                    setTimeout(() => {
                        props.updateData({ id: props.appointmentId, field: 'rating', value: value })
                    }, 1000)
                }}
            />
        </Grid>
    </Grid>
}


function ConfirmView(props) {

    return <Grid container alignItems='center' sx={{ pt: 2, pb: 2 }}>
        <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <RecommendIcon color='disabled' />
        </Grid>
        <Grid item xs={10} sx={{ textAlign: 'center' }}>
            <ConfirmAppointmentButton
                variant='contained'
                sx={{ width: '100%' }}
                appointmentId={props.appointmentId}
                onSuccess={() => {
                    setTimeout(() => {
                        props.updateData({ id: props.appointmentId, field: 'status', value: 'confirmed' })
                    }, 1000)
                }}
            />
        </Grid>
    </Grid>
}


function StartMeetingView(props) {

    localStorage.setItem('appointmentId', props.appointmentData.id)

    const history = useHistory()

    const user = props.appointmentData.user
    const connection = props.appointmentData.connection

    const userId = user.id ? user.id : user.user
    const connectionId = connection.id ? connection.id : connection.user

    const createNote = () => {
        NoteDAO.createNote({
            participants: [userId, connectionId],
            onSuccess: (res) => {
                const hostname = window.location.hostname
                const protocol = window.location.protocol
                const port = window.location.port
                const baseName = port ? `${hostname}:${port}` : hostname
                const meetingUrl = `${protocol}//${baseName}${Constant.URL.MEETING}`
                history.push(Constant.URL.MEETING_NOTE + '/' + res.id)
                window.open(meetingUrl)
            },
            onFailure: () => { }
        })
    }

    return <Stack
        sx={{ pt: 2, pb: 2 }}
        spacing={1}
        justifyContent='center'
        alignItems='center'>
        <Typography align='center' variant='caption'>
            Meeting Link available 15 min before <br /> the beginning of the Appointment
        </Typography>
        <Grid container alignItems="center">
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                <VideoCallIcon color='disabled' />
            </Grid>
            <Grid item xs={10} sx={{ textAlign: 'center' }}>
                <Button
                    disabled={props.disabled}
                    variant='contained'
                    sx={{ width: '100%' }}
                    onClick={createNote}>
                    Join Meeting
                </Button>
            </Grid>
        </Grid>
    </Stack >
}


function CustomTuteeHeader({ children, appointmentData, ...restProps }) {

    const now = new Date()
    const pastTime = now.getTime() > appointmentData.startDate.getTime()

    return <AppointmentTooltip.Header
        {...restProps}
        appointmentData={appointmentData}
        showOpenButton={false}
        showDeleteButton={appointmentData.status !== 'confirmed' && !pastTime} />
}


function CustomTutorHeader({ children, appointmentData, ...restProps }) {

    const now = new Date()
    const pastTime = now.getTime() > appointmentData.startDate.getTime()

    return <AppointmentTooltip.Header
        {...restProps}
        appointmentData={appointmentData}
        showOpenButton={false}
        showDeleteButton={!pastTime || appointmentData.status === 'available'} />
}


function CustomContent({ children, appointmentData, setMessagingConnection, ...restProps }) {

    const passMessagingConnection = () => {
        setMessagingConnection(appointmentData.connection)
    }

    return <AppointmentTooltip.Content
        {...restProps}
        appointmentData={appointmentData} >
        {appointmentData.status !== 'available' && <Stack
            justifyContent='center'
            alignItems='center'>
            <Grid container alignItems="center">
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <MonetizationOnIcon color='disabled' />
                </Grid>
                <Grid item xs={10}>
                    <Typography > ${(appointmentData.price / 100).toFixed(2)} </Typography>
                </Grid>
            </Grid>
            <Button
                startIcon={<ForumIcon />}
                onClick={passMessagingConnection}>
                Chat
            </Button>
        </Stack>
        }
        {children}
        {appointmentData.status !== 'available' && <Stack spacing={2} sx={{ padding: 2 }}>
            <Typography variant='h5'>
                Message
            </Typography>
            <Typography align='justify'>
                {appointmentData.message}
            </Typography>
        </Stack>}
    </AppointmentTooltip.Content>
}


function CustomAppointmentTooltip({ updateData, contentComponent, setMessagingConnection, ...restProps }) {

    const [visible, setVisible] = useState(restProps.visible)

    const setMessaging = (val) => {
        setMessagingConnection(val)
        setVisible(false)
    }

    return <AppointmentTooltip
        {...restProps}
        visible={visible}
        onVisibilityChange={setVisible}
        contentComponent={contentComponent(updateData, setMessaging)}

    />
}


function CustomTuteeContent(updateData, setMessagingConnection) {
    return ({ children, appointmentData, ...restProps }) => {

        const now = new Date()
        const pastTime = now.getTime() > appointmentData.endDate.getTime()
        const marginTime = 1000 * 60 * 15
        const meetingDisabled = now.getTime() < appointmentData.startDate.getTime() - marginTime
        const confirmed = appointmentData.status === 'confirmed'

        const view = () => {
            if (confirmed) {
                return (
                    pastTime ? (
                        <RatingView
                            updateData={updateData}
                            appointmentId={appointmentData.id}
                            rating={appointmentData.rating} />
                    ) : (
                        <StartMeetingView
                            disabled={meetingDisabled}
                            appointmentData={appointmentData} />
                    )
                )
            }
            return null
        }

        return <CustomContent
            {...restProps}
            setMessagingConnection={setMessagingConnection}
            appointmentData={appointmentData} >
            {view()}
        </CustomContent>
    }
}


function CustomTutorContent(updateData, setMessagingConnection) {
    return ({ children, appointmentData, ...restProps }) => {

        const now = new Date()
        const pastTime = now.getTime() > appointmentData.endDate.getTime()
        const marginTime = 1000 * 60 * 15
        const meetingDisabled = now.getTime() < appointmentData.startDate.getTime() - marginTime

        const view = () => {
            if (!pastTime) {
                if (appointmentData.status === 'pending') {
                    return <ConfirmView
                        updateData={updateData}
                        appointmentId={appointmentData.id} />
                } else if (appointmentData.status === 'confirmed') {
                    return <StartMeetingView
                        disabled={meetingDisabled}
                        appointmentData={appointmentData} />
                } else {
                    return null
                }
            }
            return null
        }

        return <CustomContent
            {...restProps}
            setMessagingConnection={setMessagingConnection}
            appointmentData={appointmentData} >
            {view()}
        </CustomContent>
    }
}

function CustomCancelButton(appointmentData, loading) {

    return ({ ...restProps }) => {

        if (restProps.title !== 'Delete') {
            return <ConfirmationDialog.Button {...restProps} />
        }

        const title = appointmentData.status === 'confirmed' ? 'Refund' : 'Delete'

        return <>
            <ConfirmationDialog.Button
                {...restProps}
                title={loading ? <CircularProgress /> : title} />
            <RefundInformation />
        </>
    }
}


function CustomConfirmLayout(updateData, filterAppointments) {
    return function Inner({ buttonComponent, isDeleting, appointmentData, handleConfirm, ...restProps }) {
        const [loading, setLoading] = useState(false)
        if (!isDeleting) {
            return <ConfirmationDialog.Layout
                {...restProps}
                buttonComponent={buttonComponent}
                appointmentData={appointmentData}
                isDeleting={isDeleting} />
        }

        const customHandleConfirm = () => {
            setLoading(true)
            if (appointmentData.status === 'available') {
                AppointmentDAO.deleteAppointment({
                    appointmentId: appointmentData.id,
                    onSuccess: (mess) => {
                        setLoading(false)
                        filterAppointments({ id: appointmentData.id })
                        handleConfirm()
                    },
                    onFailure: (mess) => {
                        setLoading(false)
                    }
                })
            } else {
                PaymentDAO.cancelAppointment({
                    appointmentId: appointmentData.id,
                    onSuccess: (res) => {
                        setLoading(false)
                        updateData({ id: appointmentData.id, field: 'status', value: 'available' })
                        handleConfirm()
                    },
                    onFailure: (res) => {
                        setLoading(false)
                    },
                })
            }
        }

        return <ConfirmationDialog.Layout
            {...restProps}
            buttonComponent={CustomCancelButton(appointmentData, loading)}
            appointmentData={appointmentData}
            isDeleting={isDeleting}
            handleConfirm={() => {
                customHandleConfirm()
            }}
        />
    }
}

const ToolbarWithLoading = (
    ({ children, ...restProps }) => (
        <div style={{ position: 'relative' }}>
            <Toolbar.Root {...restProps}>
                {children}
            </Toolbar.Root>
            <LinearProgress sx={{
                position: 'absolute',
                width: '100%',
                bottom: 0,
                left: 0
            }} />
        </div>
    )
)

const Title = (props) => {
    return <Stack
        direction='row'
        spacing={2}
        justifyContent='center'
        alignItems='center'
    >
        <div style={{
            backgroundColor: props.color[400],
            borderRadius: '50%',
            width: 20,
            height: 20
        }} />
        <p>{props.title}</p>
    </Stack>
}

const FlexibleSpace = (({
    value,
    handleChange,
    ...restProps
}) => (
    <Toolbar.FlexibleSpace {...restProps} style={{ margin: '0 auto 0 0' }}>
        <FormControl fullWidth sx={{ ml: 10 }}>
            <Select
                value={value}
                variant='standard'
                label='Status'
                disableUnderline
                onChange={(e) => {
                    handleChange(e.target.value);
                }}>
                <MenuItem value='all'><Title color={grey} title='All' /></MenuItem>
                <MenuItem value='available'><Title color={blue} title='Available' /></MenuItem>
                <MenuItem value='pending'><Title color={red} title='Pending' /> </MenuItem>
                <MenuItem value='confirmed'><Title color={green} title='Confirmed' /></MenuItem>
            </Select>
        </FormControl>
    </Toolbar.FlexibleSpace >
))


const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(9),
    right: theme.spacing(4),
    zIndex: 1000,
}))



class BaseCalendar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            appointments: [],
            currentDate: new Date(),
            startDayHour: 9,
            endDayHour: 17,
            loading: false,
            selectedStatus: 'all',
            editingFormVisible: false,
        }

        this.getAppointments = this.getAppointments.bind(this)
        this.updateData = this.updateData.bind(this)
        this.filterAppointments = this.filterAppointments.bind(this)
        this.commitChanges = this.commitChanges.bind(this)
        this.changeStatus = this.changeStatus.bind(this)
        this.toggleEditingFormVisibility = this.toggleEditingFormVisibility.bind(this)

        this.statusData = {
            fieldName: 'status',
            title: 'Status',
            instances: [
                { id: 'available', text: 'Available', color: blue },
                { id: 'pending', text: 'Pending', color: red },
                { id: 'confirmed', text: 'Confirmed', color: green },
            ],
        }

        this.flexibleSpace = connectProps(FlexibleSpace, () => {
            return {
                value: this.state.selectedStatus,
                handleChange: this.changeStatus,
            }
        })

        this.defaultAppointment = {
            title: 'Available',
            startDate: new Date(new Date(this.state.currentDate).setHours(this.state.startDayHour)),
            endDate: new Date(new Date(this.state.currentDate).setHours(this.state.startDayHour + 1)),
            status: 'available'

        }

        this.appointmentForm = connectProps(AppointmentFormContainerBasic, () => {
            return {
                appointmentData: this.defaultAppointment,
                onVisibilityChange: this.toggleEditingFormVisibility,
                commitChanges: this.commitChanges,
                userId: this.props.userId
            }
        })
    }

    componentDidMount() {
        this.getAppointments(this.state.currentDate, this.props.userId)
    }

    componentDidUpdate() {
        this.flexibleSpace.update()
        this.appointmentForm.update()
    }

    changeStatus(value) {
        this.setState({ selectedStatus: value });
    }

    getMonday(date) {
        date = new Date(date)
        var day = date.getDay(),
            diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        date.setDate(diff)
        date.setHours(0, 0, 0, 0)
        return new Date(date);
    }

    addWeek(date) {
        date = new Date(date)
        return new Date(date.setDate(date.getDate() + 7))
    }

    convertAppointments(appointments) {

        return appointments.map((apt) => {

            var title = null
            if (apt.status === 'available') {
                title = 'Available'
            } else {
                const username = this.props.isTutor ? (
                    apt.tutee.username
                ) : (
                    apt.tutor.first_name.concat(' ', apt.tutor.last_name)
                )
                title = `With ${username}`
            }
            const startDate = new Date(apt.date_time)
            const endDate = new Date(startDate)
            endDate.setMinutes(endDate.getMinutes() + apt.duration)
            const connection = this.props.isTutor ? apt.tutee : apt.tutor
            const user = this.props.isTutor ? apt.tutor : apt.tutee

            return {
                id: apt.id,
                title: title,
                startDate: startDate,
                endDate: endDate,
                price: apt.cost,
                message: apt.message,
                status: apt.status,
                rating: apt.rating,
                connection: connection,
                user: user
            }
        })
    }

    getArrayRange(array) {
        if (array.length === 0) {
            return [9, 17]
        }

        const minHour = Math.min(...array.map(apt => apt.startDate.getHours()))
        const maxHour = Math.max(...array.map(apt => apt.endDate.getHours())) + 1
        if (minHour < maxHour) {
            return [Math.min(minHour, 9), Math.max(maxHour, 17)]
        } else {
            return [Math.min(minHour, 9), 24]
        }
    }

    getAppointments(currentDate, userId) {

        const startDate = this.getMonday(currentDate)
        const endDate = this.addWeek(startDate)
        this.setState({ loading: true })
        AppointmentDAO.getAppointmentInRange({
            userId: userId,
            isTutor: this.props.isTutor,
            startDate: startDate,
            endDate: endDate,
            onSuccess: (apts) => {
                const appointments = this.convertAppointments(apts)
                const [minHour, maxHour] = this.getArrayRange(appointments)
                this.setState({
                    appointments: appointments,
                    startDayHour: minHour,
                    endDayHour: maxHour,
                    loading: false
                })
            },
            onFailure: () => { }
        })
    }

    updateData({ id, field, value }) {
        const apts = this.state.appointments.map(apt => {
            if (apt.id === id) {
                apt[field] = value
                return apt
            }
            return apt
        })
        this.setState({ appointments: apts })
    }

    filterAppointments({ id }) {
        this.setState((state) => {
            let { appointments } = state
            appointments = appointments.filter(appointment => appointment.id !== id)
            return { appointments }
        })
    }

    commitChanges({ added }) {
        this.setState((state) => {
            let { appointments, startDayHour, endDayHour } = state;
            if (added) {
                const startingAddedId = appointments.length > 0 ? appointments[appointments.length - 1].id + 1 : 0
                appointments = [...appointments, { id: startingAddedId, ...added }]
            }
            [startDayHour, endDayHour] = this.getArrayRange(appointments)
            return { appointments, startDayHour, endDayHour }
        })
    }

    filterPerStatus(data, status) {
        if (status === 'all') return data
        return data.filter(d => d.status === status)
    }

    toggleEditingFormVisibility() {
        const { editingFormVisible } = this.state;
        if (editingFormVisible) {
            this.setState({ editingFormVisible: !editingFormVisible })
        }
    }

    render() {

        return <Scheduler
            data={this.filterPerStatus(this.state.appointments, this.state.selectedStatus)}
            firstDayOfWeek={1}
        >
            <ViewState
                currentDate={this.state.currentDate}
                onCurrentDateChange={(currentDate) => {
                    this.setState({ currentDate: currentDate })
                    this.getAppointments(currentDate, this.props.userId)
                }}
            />
            <WeekView
                startDayHour={this.state.startDayHour}
                endDayHour={this.state.endDayHour} />
            <EditingState onCommitChanges={this.commitChanges} />
            <Toolbar
                {...this.state.loading ? { rootComponent: ToolbarWithLoading } : null}
                flexibleSpaceComponent={this.flexibleSpace}
            />
            <DateNavigator />
            <TodayButton />
            <Appointments
                placeAppointmentsNextToEachOther
            />
            <Resources
                data={[this.statusData]}
                mainResourceName="status"
            />
            <IntegratedEditing />
            <ConfirmationDialog
                ignoreCancel
                layoutComponent={CustomConfirmLayout(
                    this.updateData,
                    this.filterAppointments
                )}
            />
            <CustomAppointmentTooltip
                updateData={this.updateData}
                setMessagingConnection={this.props.setMessagingConnection}
                headerComponent={this.props.customHeader}
                contentComponent={this.props.customContent}
                showCloseButton
                showOpenButton
                showDeleteButton
            />
            <CurrentTimeIndicator
                shadePreviousCells={true}
                shadePreviousAppointments={true}
                updateInterval={10}
            />
            <AppointmentForm
                overlayComponent={this.appointmentForm}
                visible={this.state.editingFormVisible}
                onVisibilityChange={this.toggleEditingFormVisibility}
            />
            {this.props.isTutor && <StyledFab
                color="secondary"
                onClick={() => {
                    this.setState({ editingFormVisible: true })
                }}>
                <AddIcon />
            </StyledFab>}
        </Scheduler>
    }
}


function TuteeCalendar(props) {
    return <BaseCalendar
        userId={props.userId}
        isTutor={false}
        setMessagingConnection={props.setMessagingConnection}
        customHeader={CustomTuteeHeader}
        customContent={CustomTuteeContent} />
}


function TutorCalendar(props) {
    return <BaseCalendar
        userId={props.userId}
        isTutor={true}
        setMessagingConnection={props.setMessagingConnection}
        customHeader={CustomTutorHeader}
        customContent={CustomTutorContent} />
}


function Calendar(props) {
    const [value, setValue] = React.useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const isTutor = props.isTutor

    if (isTutor) {
        return <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label='Teaching Calendar' value='1' />
                    <Tab label='Learning Calendar' value='2' />
                </TabList>
            </Box>
            <TabPanel value='1'>
                <TutorCalendar
                    setMessagingConnection={props.setMessagingConnection}
                    userId={props.userId} />
            </TabPanel>
            <TabPanel value='2'>
                <TuteeCalendar
                    setMessagingConnection={props.setMessagingConnection}
                    userId={props.userId} />
            </TabPanel>
        </TabContext>
    } else {
        return <TuteeCalendar userId={props.userId} />
    }

}


function UpcomingAppointments({ userId, isTutor, setMessagingConnection, ...restProps }) {

    return <>
        <Typography variant='h6' align='center' style={{ margin: 2 }}>
            Upcoming Appointments
        </Typography>
        {userId ? <FutureAppointments
            userId={userId}
            isTutor={isTutor}
            setMessagingConnection={setMessagingConnection}
            status='confirmed' /> : <CircularProgress />}
    </>
}

function NewAppointments({ userId, isTutor, setMessagingConnection, ...restProps }) {
    return <>
        <Typography variant='h6' align='center' style={{ margin: 2 }}>
            Appointments to Confirm
        </Typography>
        {userId ? <FutureAppointments
            userId={userId}
            isTutor={isTutor}
            setMessagingConnection={setMessagingConnection}
            status='pending' /> : <CircularProgress />}
    </>
}

function MessagingBox({ userId, connection, onClose, sx, ...props }) {

    if (!connection) return null

    var username = null
    if (connection.tutor) {
        username = `${connection.tutor.first_name} ${connection.tutor.last_name}`
    } else if (connection.username) {
        username = connection.username
    } else if (connection.first_name) {
        username = `${connection.first_name} ${connection.last_name}`
    }

    return <Paper
        sx={sx}>
        <Stack
            {...props}
            sx={{ width: '100%' }}
            spacing={2}>
            <IconButton onClick={onClose}>
                <CloseIcon />
            </IconButton>
            <Typography align='center' variant='h5'>
                {username}
            </Typography>
            <Messaging
                minHeight='70vh'
                connection={connection}
                userId={userId}
                style={{ height: '100%' }} />
        </Stack >
    </Paper>
}


export default class CalendarPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            userId: null,
            isTutor: false,
            activeTab: 0,
            messageConnection: null,
            uniqueId: Math.random(),
        }
        this.setMessagingConnection = this.setMessagingConnection.bind(this)
        this.closeMessaging = this.closeMessaging.bind(this)
    }

    componentDidMount() {
        Auth.auth().onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                UserDAO.getUser({
                    userId: firebaseUser.uid,
                    onSuccess: (user) => {
                        this.setState({
                            user: user,
                            userId: firebaseUser.uid,
                            isTutor: user.tutor !== null,
                        })
                    },
                    onFailure: () => { }
                })
            }
        })
    }

    setMessagingConnection(messageConnection) {
        this.setState({
            uniqueId: Math.random(),
            messageConnection: messageConnection
        })
    }

    closeMessaging() {
        this.setState({ messageConnection: null })
    }

    renderDesktop() {
        return <>
            {this.state.messageConnection && <MessagingBox
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    position: 'absolute',
                    bottom: 10,
                    right: 100,
                    zIndex: 10000,
                    padding: 1,
                    width: 300,
                    height: '70vh'
                }}
                key={this.state.uniqueId}
                userId={this.state.userId}
                onClose={this.closeMessaging}
                connection={this.state.messageConnection} />}
            <Grid container spacing={2} columns={12} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Grid item xs={2}>
                    <Paper sx={{ height: '90vh', overflow: 'auto' }}>
                        <UpcomingAppointments
                            userId={this.state.userId}
                            isTutor={this.state.isTutor}
                            setMessagingConnection={this.setMessagingConnection}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={8} sx={{ height: '90vh', overflow: 'auto' }}>
                    {this.state.user ? <Calendar
                        isTutor={this.state.isTutor}
                        userId={this.state.userId}
                        setMessagingConnection={this.setMessagingConnection}
                    /> : <CircularProgress />}
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Paper sx={{ height: '90vh' }}>
                        <NewAppointments
                            userId={this.state.userId}
                            isTutor={this.state.isTutor}
                            setMessagingConnection={this.setMessagingConnection}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </>
    }

    renderMobile() {
        return (this.state.messageConnection ? <MessagingBox
            sx={{ display: { xs: '', md: 'none' }, height: '70vh' }}
            key={this.state.uniqueId}
            userId={this.state.userId}
            onClose={this.closeMessaging}
            connection={this.state.messageConnection}
        /> : <Box sx={{ pt: 5, pb: 9, display: { xs: '', md: 'none' }, overflow: 'auto' }}>
            {(this.state.activeTab === 0) && <UpcomingAppointments
                userId={this.state.userId}
                isTutor={this.state.isTutor}
                setMessagingConnection={this.setMessagingConnection} />}
            {(this.state.activeTab === 1) && <NewAppointments
                userId={this.state.userId}
                isTutor={this.state.isTutor}
                setMessagingConnection={this.setMessagingConnection} />}
            {(this.state.activeTab === 2) && (this.state.user ? <Calendar
                isTutor={this.state.isTutor}
                userId={this.state.userId}
                setMessagingConnection={this.setMessagingConnection}
            /> : <CircularProgress />)}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={this.state.activeTab}
                    sx={{ background: warningColor }}
                    onChange={(e, active) => this.setState({ activeTab: active })}
                >
                    <BottomNavigationAction label='Upcoming' icon={<ScheduleIcon />} sx={{ minWidth: '15px' }} />
                    <BottomNavigationAction label='To Confirm' icon={<RunningWithErrorsIcon />} sx={{ minWidth: '15px' }} />
                    <BottomNavigationAction label='Calendar' icon={<TodayIcon />} sx={{ minWidth: '15px' }} />

                </BottomNavigation>
            </Paper>
        </Box>)
    }


    render() {

        return <>
            {this.renderDesktop()}
            {this.renderMobile()}
        </>
    }
}