import React, { useState, useEffect, useCallback } from 'react'
import {
    Stack,
    Typography,
    CircularProgress,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Collapse,
    IconButton,
    Grid,
    Button,
    Box,
    Tooltip
} from '@mui/material'
import InfiniteScroll from 'react-infinite-scroller'
import { red, green, blue } from '@mui/material/colors'
import { AppointmentDAO } from 'api/marketplaceDAO'
import { styled } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import RecommendIcon from '@mui/icons-material/Recommend'
import { useHistory } from 'react-router-dom'
import Constant from 'utils/constants'
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4'
import { ConfirmAppointmentButton } from './Buttons'
import { NoteDAO } from 'api/noteDAO'


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

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}))


function ConfirmView(props) {

    const [confirmed, setConfirmed] = useState(false)

    const color = confirmed ? 'success' : 'disabled'

    return <Box sx={{ ml: 1, m: 1 }}>
        <Grid container alignItems='center'>
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                <RecommendIcon color={color} />
            </Grid>
            <Grid item xs={10} sx={{ textAlign: 'center' }}>
                {confirmed ? <Typography
                    sx={{ color: 'green' }}
                    variant='h6'
                    align='center'>
                    Confirmed
                </Typography> : <ConfirmAppointmentButton
                    variant='contained'
                    color='error'
                    sx={{ width: '100%' }}
                    appointmentId={props.appointmentId}
                    onSuccess={() => {
                        setConfirmed(true)
                    }}
                />}

            </Grid>
        </Grid>
    </Box>
}


function StartMeetingView(props) {

    localStorage.setItem('appointmentId', props.appointment.id)
    const history = useHistory()

    const tutee = props.appointment.tutee
    const tutor = props.appointment.tutor

    const createNote = () => {
        NoteDAO.createNote({
            participants: [tutee.id, tutor.user],
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
        sx={{ ml: 1, mr: 1 }}
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


function AppointmentCard({ appointment, isTutor, setMessagingConnection, ...restProps }) {

    const [expanded, setExpanded] = useState(false)

    const handleExpandClick = () => {
        setExpanded(!expanded);
    }

    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }

    const colorMap = {
        'pending': red[400],
        'confirmed': green[400],
        'available': blue[400]
    }

    const color = colorMap[appointment.status]

    var title = null
    const username = isTutor ? (
        appointment.tutee.username
    ) : (
        appointment.tutor.first_name.concat(' ', appointment.tutor.last_name)
    )
    title = `With ${username}`
    const startDate = new Date(appointment.date_time)
    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + appointment.duration)
    const subheader = `${startDate.toLocaleString('en-US', options)} - ${endDate.toLocaleString('en-US', options)}`

    const pictureItem = isTutor ? <Avatar
        sx={{ width: 30, height: 30 }}
        alt={username}
    >
        {username.charAt(0).toUpperCase()}
    </Avatar> : <Avatar
        sx={{ width: 30, height: 30 }}
        src={appointment.tutor.picture}
        alt={username}
    >
        {username.charAt(0).toUpperCase()}
    </Avatar>

    const now = new Date()
    const marginTime = 1000 * 60 * 15
    const meetingDisabled = false // now.getTime() < startDate.getTime() - marginTime

    const view = () => {
        if (appointment.status === 'pending' && isTutor) {
            return <ConfirmView
                appointmentId={appointment.id} />
        } else if (appointment.status === 'confirmed') {
            return <StartMeetingView
                disabled={meetingDisabled}
                appointment={appointment} />
        } else {
            return null
        }
    }

    const passMessagingConnection = () => {
        const connection = isTutor ? (
            appointment.tutee
        ) : (
            appointment.tutor
        )
        setMessagingConnection(connection)
    }

    return <Card sx={{ maxWidth: 345, margin: 1 }}>
        <Tooltip title="Chat" arrow>
            <IconButton onClick={passMessagingConnection}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
                            {pictureItem}
                        </Avatar>}
                    title={title}
                    subheader={subheader}
                />
            </IconButton>
        </Tooltip>
        {view()}
        <CardActions disableSpacing>
            <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more">
                <ExpandMoreIcon />
            </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
                <Typography paragraph>
                    {appointment.message}
                </Typography>
            </CardContent>
        </Collapse>
    </Card>
}


export function FutureAppointments({ userId, isTutor, status, setMessagingConnection, ...restProps }) {

    const [page, setPage] = useState(1)
    const [appointments, setAppointments] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [connectionOk, setConnectionOk] = useState(true)

    var date = new Date()
    date.setHours(date.getHours() - 1)

    const fetchData = () => {

        AppointmentDAO.getAllAppointments({
            user_id: userId,
            isTutor: isTutor,
            future: true,
            date: date,
            page: page,
            status: status,
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

    return (connectionOk ? <InfiniteScroll
        pageStart={0}
        loadMore={fetchData}
        hasMore={hasMore}
        useWindow={false}
        loader={<CircularProgress key={0} />}
    >
        {appointments.map((appointment) => {
            return <AppointmentCard
                setMessagingConnection={setMessagingConnection}
                key={appointment.id}
                appointment={appointment}
                isTutor={isTutor} />
        })}
    </InfiniteScroll> : <BadConnection />)

}
