

import React, { useState, useEffect } from 'react'
import {
    Grid,
    Box,
    Stack,
    Button,
    Typography
} from '@mui/material'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import match from 'logo/match.svg'
import schedule from 'logo/schedule.svg'
import meet from 'logo/meet.svg'
import collaborate from 'logo/collaborate.svg'

import LoginContainer from 'modals/login/LoginContainer'
import CreateProfileContainer from 'modals/create_profile/CreateProfileContainer'

import { Auth } from 'modals/login/firebase_auth'
import { useAuthState } from 'react-firebase-hooks/auth'


function About() {

    const [loginOpen, setLoginOpen] = useState(false)
    const [createProfileOpen, setCreateProfileOpen] = useState(false)
    const [user, loading] = useAuthState(Auth.auth())

    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('md'))

    useEffect(() => {
        if (loading) {
            return
        }
    }, [user, loading])


    const handleCreateProfileClose = () => {
        setCreateProfileOpen(false)
    }

    const handleLoginClose = () => {
        setLoginOpen(false)
    }

    const createProfileButtonClick = () => {
        if (user) {
            setCreateProfileOpen(true)
        } else {
            setLoginOpen(true)
        }
    }

    return <>
        {loginOpen && <LoginContainer
            open={loginOpen}
            onClose={handleLoginClose}
        />}
        {createProfileOpen && user && <CreateProfileContainer
            open={createProfileOpen}
            onClose={handleCreateProfileClose}
            userId={user.uid}
        />}
        <Box sx={{ height: '100%', pt: 5 }}>

            {mobile ? <Stack
                justifyContent='center'
                alignItems='center'
                spacing={3}>

                <h2>We Empower People to Share Knowledge </h2>

                <p>
                    Shareyourwiz is a platform to exchange tutoring, coaching or consulting services between people.
                    Anybody can join, teach and learn. If you know something, share it with the world and get paid for it!
                </p>

                <Button
                    variant='contained'
                    onClick={createProfileButtonClick}
                >
                    Create your Tutor Profile Now!
                </Button >

                <h3>Match</h3>
                <img src={match} alt='match' style={{ width: 250 }} />
                <Typography align='center'>
                    Filter your Tutors or you Tutees based on price, rating, schedule, specialties and more.
                    Chat online to make sure you are a good fit for each other!
                </Typography>

                <h3>Schedule</h3>
                <img src={schedule} alt='schedule' style={{ width: 250 }} />
                <Typography align='center'>
                    Manage you schedule online as you please at the price you want.
                    The Tutees directly provide secure payments to the Tutors through the platform.
                </Typography>

                <h3>Meet</h3>
                <img src={meet} alt='meet' style={{ width: 250 }} />
                <Typography align='center' >
                    We provide the best video conference technology to meet online safely.
                    Teach to any student around the world from your own home.
                </Typography>

                <h3>Collaborate</h3>
                <img src={collaborate} alt='collaborate' style={{ width: 250 }} />
                <Typography align='center'>
                    We are working on building the finest collaboration tools to use during a meeting or after.
                    Share notes, code or diagrams interactively.
                </Typography>
            </Stack> : <Stack
                justifyContent='center'
                alignItems='center'
                spacing={3}>

                <h2>We Empower People to Share Knowledge </h2>

                <p>
                    Shareyourwiz is a platform to exchange tutoring, coaching or consulting services between people.
                    Anybody can join, teach and learn. If you know something, share it with the world and get paid for it!
                </p>

                <Button
                    variant='contained'
                    onClick={createProfileButtonClick}>
                    Create your Tutor Profile Now!
                </Button >

                <Stack
                    direction='row'
                    justifyContent='center'
                    alignItems='center'
                    spacing={3}>
                    <Typography align='right' sx={{ width: 250 }}>
                        <h3>Match</h3>
                        Filter your Tutors or you Tutees based on price, rating, schedule, specialties and more.
                        Chat online to make sure you are a good fit for each other!
                    </Typography>
                    <img src={match} alt='match' style={{ width: 250 }} />
                </Stack>

                <Stack
                    direction='row'
                    justifyContent='center'
                    alignItems='center'
                    spacing={3}>
                    <img src={schedule} alt='schedule' style={{ width: 250 }} />
                    <Typography align='left' sx={{ width: 250 }}>
                        <h3>Schedule</h3>
                        Manage you schedule online as you please at the price you want.
                        The Tutees directly provide secure payments to the Tutors through the platform.
                    </Typography>
                </Stack>

                <Stack
                    direction='row'
                    justifyContent='center'
                    alignItems='center'
                    spacing={3}>
                    <Typography align='right' sx={{ width: 250 }}>
                        <h3>Meet</h3>
                        We provide the best video conference technology to meet online safely.
                        Teach to any student around the world from your own home.
                    </Typography>
                    <img src={meet} alt='meet' style={{ width: 250 }} />
                </Stack>

                <Stack
                    direction='row'
                    justifyContent='center'
                    alignItems='center'
                    spacing={3}>
                    <img src={collaborate} alt='collaborate' style={{ width: 250 }} />
                    <Typography align='left' sx={{ width: 250 }}>
                        <h3>Collaborate</h3>
                        We are working on building the finest collaboration tools to use during a meeting or after.
                        Share notes, code or diagrams interactively.
                    </Typography>
                </Stack>
            </Stack>}
        </Box>
    </>
}

export default function AboutPage() {

    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('md'))

    return (mobile ? <About /> : <Grid container spacing={2} columns={12} sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={6} sx={{ height: '100%' }}>
            <About />
        </Grid>
        <Grid item xs={3} >
        </Grid>
    </Grid>)
}