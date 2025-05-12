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
    Grid,
    Button,
    BottomNavigation,
    BottomNavigationAction,
    TextField,
    Skeleton,
    Snackbar,
    Alert,
} from '@mui/material'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Appointments from 'components/Appointments'
import OtherLinks from 'main_views/OtherLinks'
import ScheduleIcon from '@mui/icons-material/Schedule'
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'
import {
    warningColor,
} from 'assets/jss/material-kit-react.js'
import Constant from 'utils/constants'
import CustomModal from 'components/CustomModal'
import CreateProfileContainer from 'modals/create_profile/CreateProfileContainer'
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
                Type  'delete my account ' and submit.
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


function BecomeTutorButton(props) {

    const [createProfileOpen, setCreateProfileOpen] = useState(false)

    return <>
        {createProfileOpen && <CreateProfileContainer
            open={createProfileOpen}
            onClose={() => setCreateProfileOpen(false)}
            userId={props.user.id}
        />}
        <Button
            variant='contained'
            onClick={() => setCreateProfileOpen(true)}
        >
            Become a tutor
        </Button>
    </>
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
                onFailure: () => { }
            })

        }}>
        See Invoice History
    </Button>
}


function UserProfileCard(props) {

    return <Stack
        justifyContent='center'
        alignItems='center'
        sx={{ display: '', pt: 3 }}
        spacing={2}>
        <Typography sx={{ mr: 1 }} >
            {props.user.username}
        </Typography>
        {props.user.credit !== 0 && <Typography>
            <b>Credit:</b> ${(props.user.credit / 100).toFixed(2)}
        </Typography>}
        <BecomeTutorButton user={props.user} />
        <GoToInvoiceButton user={props.user} />
        <DeleteAccountButton />
    </Stack>
}


function SkeletonCard() {
    return <Stack
        spacing={1}
        sx={{ width: '100%', pt: 3 }}
        justifyContent='center'
        alignItems='center'>
        <Skeleton variant='text' width='90%' />
        <Skeleton variant='rectangular' width='90%' height={300} />
    </Stack>
}

function ProfileCard(props) {

    if (!props.user) {
        return <SkeletonCard />
    } else {
        return <UserProfileCard user={props.user} />
    }
}


function Options(props) {

    const [value, setValue] = React.useState('appointment');

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} >
                <Tab label='Appointments' value='appointment' />
                <Tab label='Meeting Notes' value='note' />
            </TabList>
        </Box>
        <TabPanel value='appointment'>
            <Appointments user={props.user} />
        </TabPanel>
        <TabPanel value='note'>
            <MeetingNotesList user={props.user}/>
        </TabPanel>
    </TabContext>
}


class UserProfilePage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            updateProfileOpen: false,
            openAppointments: false,
            activeTab: 0
        }
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
        return <>
            {this.renderProfile()}
            {this.renderMobileProfile()}
        </>
    }
}

export default withRouter(UserProfilePage)