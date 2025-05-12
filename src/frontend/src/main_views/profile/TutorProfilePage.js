import React, { useState, useEffect } from 'react'
import { useHistory, withRouter } from 'react-router'
import { Auth } from 'modals/login/firebase_auth'
import { UserDAO } from 'api/marketplaceDAO'
import { PaymentDAO } from 'api/paymentDAO'
import {
    Stack,
    Box,
    Typography,
    Paper,
    Avatar,
    Grid,
    Button,
    BottomNavigation,
    BottomNavigationAction,
    CircularProgress,
    TextField,
    Rating,
    Skeleton,
    Snackbar,
    Alert,
    Link
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import IconButton from '@mui/material/IconButton'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import Appointments from 'components/Appointments'
import UpdateProfileContainer from 'modals/create_profile/UpdateProfileContainer'
import OtherLinks from 'main_views/OtherLinks'
import SetAppointmentContainer from 'modals/appointments/SetAppointmentContainer'
import ScheduleIcon from '@mui/icons-material/Schedule'
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import {
    warningColor,
} from 'assets/jss/material-kit-react.js'
import Constant from 'utils/constants'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CustomModal from 'components/CustomModal'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import MeetingNotesList from './MeetingNotesList'
import DescriptionIcon from '@mui/icons-material/Description'


function DeleteAccountView(props) {

    const [text, setText] = useState()
    const history = useHistory()

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
        <Stack spacing={1} >
            <Typography>
                Are you sure you want to delete you account? This Cannot be undone!
            </Typography>
            <Typography>
                Type "delete my account" and submit.
            </Typography>
            <TextField
                placeholder='delete my account'
                onChange={(e) => setText(e.target.value)}
            />
            <Button variant='contained'
                disabled={text !== 'delete my account'}
                onClick={() => {
                    Auth.delete(
                        () => history.replace(Constant.URL.ROOT),
                        () => { }
                    )
                }}
            >
                Submit
            </Button>
        </Stack>
    </CustomModal>
}


function DeleteAccountButton(props) {

    const [openDeleteView, setOpenDeleteView] = useState(false)

    return <>
        {openDeleteView && <DeleteAccountView
            open={openDeleteView}
            onClose={() => setOpenDeleteView(false)} />}
        <Button
            color='error'
            variant='contained'
            onClick={() => setOpenDeleteView(true)}>
            Delete Account
        </Button>
    </>
}


function TutorAccountActivate(props) {

    if (props.loading) {
        return <CircularProgress />
    } else if (props.accountLink) {
        return <Button
            startIcon={<WarningAmberIcon />}
            variant='contained'
            color='error'
            onClick={() => {
                window.location.href = props.accountLink
            }}
        >
            Setup Bank Account
        </Button>
    } else if (props.accountEnabled) {
        return <>
            <Typography sx={{ color: 'green' }}>
                {<CheckCircleIcon color='success' fontSize='large' />} Bank Account Activated
            </Typography>
        </>
    } else {
        return <Typography sx={{ color: 'red' }} align='center'>
            {<WarningAmberIcon color='error' fontSize='large' />} There is something wrong with the account
        </Typography>
    }
}

function TutorProfileCard(props) {

    const [accountLink, setAccountLink] = useState(null)
    const [accountEnabled, setAccountEnabled] = useState(props.profile.account_activated)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
            setLoading(true)
            PaymentDAO.createAccount({
                user: props.profile.user,
                onSuccess: (res) => {
                    setLoading(false)
                    if ('charges_enabled' in res) {
                        setAccountEnabled(true)
                    } else if ('url' in res) {
                        setAccountLink(res.url)
                        setAccountEnabled(false)
                    }
                },
                onFailure: () => {
                    setLoading(false)
                    setAccountEnabled(false)
                }
            })
    }, [])

    return (
        <Stack
            justifyContent='center'
            alignItems='center'
            sx={{ padding: 3, pb: { xs: 5, md: 3 } }}
            spacing={2}>
            <Avatar
                src={props.profile.picture}
                srcSet={`${props.profile.picture}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={props.profile.first_name}
                sx={{ width: 150, height: 150 }}>
                <PersonIcon sx={{ width: 150, height: 150 }} />
            </Avatar>
            <Typography align='center' sx={{ color: 'orange' }}>
                Advertise your Profile to your <br/> Students / Tutees / Mentors / Customers!
            </Typography>
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
            {props.profile.balance > 0 && <Typography>
                <b>Balance:</b> ${(props.profile.balance / 100).toFixed(2)}
            </Typography>}
            {props.profile.balance < 0 && <Typography>
                <b>Credit:</b> ${(-props.profile.balance / 100).toFixed(2)}
            </Typography>}
            <TutorAccountActivate
                loading={loading}
                accountEnabled={accountEnabled}
                accountLink={accountLink} />
            <Button
                variant='contained'
                onClick={props.updateProfileClick} >
                Edit Profile
            </Button>
            <GoToInvoiceButton user={props.user} />
            <Button
                disabled={Boolean(accountLink) || loading || !accountEnabled}
                startIcon={<ScheduleIcon />}
                variant='contained'
                onClick={props.openAppointments}
            >
                Setup Schedule
            </Button>
            <Typography variant='h5' align='left' sx={{ display: { xs: '', md: 'none' } }}>
                Summary
            </Typography>
            <Typography align='left' sx={{ display: { xs: '', md: 'none'}, whiteSpace: 'pre-line'}}>
                {props.profile.summary}
            </Typography>
            <DeleteAccountButton />
        </Stack>
    )
}


function GoToInvoiceButton(props) {

    if (!props.user || !props.user.stripe_customer_id) return null

    return <Button variant='contained'
    onClick={() => {
        PaymentDAO.getCustomerPortal({
            userId: props.user.id,
            onSuccess: (res) => {
                window.location.href = res.url
            },
            onFailure: () => {}
        })

    }}>
        See Invoice History
        </Button>
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

    if (!props.user) {
        return <SkeletonCard />
    } else if (props.user.tutor) {
        return <TutorProfileCard
            profile={props.user.tutor}
            user={props.user}
            updateProfileClick={props.updateProfileClick}
            openAppointments={props.openAppointments} />
    } else {
        return null
    }
}

function Summary(props) {

    if (!props.user) {
        return <Skeleton variant='rectangular' width='100%' height={200} />
    } else if (props.user.tutor) {
        return <Paper sx={{ padding: 3 }}>
            <Typography variant='h5' align='left' sx={{ mb: 2 }}>
                Summary
            </Typography>
           <Typography sx={{ whiteSpace: 'pre-line'}}>
                {props.user.tutor.summary}
            </Typography>
        </Paper>
    } else {
        return null
    }
}


function Options(props) {

    const [value, setValue] = React.useState('summary');

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} >
                <Tab label='Summary' value='summary' />
                <Tab label='Appointments' value='appointment' />
                <Tab label='Meeting Notes' value='note' />
            </TabList>
        </Box>
        <TabPanel value='summary'>
            <Summary user={props.user} />
        </TabPanel>
        <TabPanel value='appointment'>
            <Appointments user={props.user} />
        </TabPanel>
        <TabPanel value='note'>
            <MeetingNotesList user={props.user}/>
        </TabPanel>
    </TabContext>
}



class ProfilePage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            updateProfileOpen: false,
            openAppointments: false,
            activeTab: 0
        }

        this.handleUpdateProfileClose = this.handleUpdateProfileClose.bind(this)
        this.handleUpdateProfile = this.handleUpdateProfile.bind(this)
        this.handleCloseAppointments = this.handleCloseAppointments.bind(this)
    }

    componentDidMount() {
        Auth.auth().onAuthStateChanged((user) => {
            if (user) {
                UserDAO.getUser({
                    userId: user.uid,
                    onSuccess: (res) => this.setState({ user: res }),
                    onFailure: (mess) => {
                        this.props.history.replace(Constant.URL.ROOT)
                    }
                })
            }
        })
    }

    handleUpdateProfileClose() {
        this.setState({ updateProfileOpen: false })
    }

    handleUpdateProfile(profile) {
        this.setState({ profile: profile })
    }

    handleCloseAppointments() {
        this.setState({ openAppointments: false })
    }

    renderProfile() {
        return <Grid container spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Grid item xs={3}>
                <Paper sx={{ height: '90vh' }}>
                    <ProfileCard
                        user={this.state.user}
                        updateProfileClick={() => this.setState({ updateProfileOpen: true })}
                        openAppointments={() => this.setState({ openAppointments: true })}
                    />
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Stack spacing={2} sx={{ overflow: 'auto', height: '90vh' }}>
                    <Options user={this.state.user}/>
                </Stack>
            </Grid>
            <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                <OtherLinks />
            </Grid>
        </Grid>
    }

    renderMobileProfile() {
        return (
            <Box sx={{ pb: 9, display: { xs: '', md: 'none' }, height: '100%', overflow: 'auto' }}>
                {(this.state.activeTab === 0) && <ProfileCard
                    user={this.state.user}
                    updateProfileClick={() => this.setState({ updateProfileOpen: true })}
                    openAppointments={() => this.setState({ openAppointments: true })}
                />}
                {(this.state.activeTab === 1) && <Appointments user={this.state.user} />}
                {(this.state.activeTab === 2) &&  <MeetingNotesList user={this.state.user}/>}
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={this.state.activeTab}
                        sx={{ background: warningColor }}
                        onChange={(e, active) => this.setState({ activeTab: active })}
                    >
                        <BottomNavigationAction label='Profile' icon={<PermContactCalendarIcon />} sx={{ minWidth: '15px' }} />
                        <BottomNavigationAction label='Appointments' icon={<ScheduleIcon />} sx={{ minWidth: '15px' }} />
                        <BottomNavigationAction label='Meeting Notes' icon={<DescriptionIcon />} sx={{ minWidth: '15px' }} />
                    </BottomNavigation>
                </Paper>
            </Box>
        )
    }

    render() {
        return (
            <>
                {this.state.updateProfileOpen && this.state.user && this.state.user.tutor && <UpdateProfileContainer
                    open={this.state.updateProfileOpen}
                    onClose={this.handleUpdateProfileClose}
                    profile={this.state.user.tutor}
                    handleUpdateProfile={this.handleUpdateProfile} />}
                {this.state.openAppointments && this.state.user && this.state.user.tutor && <SetAppointmentContainer
                    userId={this.state.user.id}
                    open={this.state.openAppointments}
                    onClose={this.handleCloseAppointments} />}
                {this.renderProfile()}
                {this.renderMobileProfile()}
            </>
        )
    }
}

export default withRouter(ProfilePage)