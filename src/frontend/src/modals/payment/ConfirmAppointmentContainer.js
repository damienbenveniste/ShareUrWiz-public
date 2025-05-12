import React, { useState, useEffect } from 'react'
import {
    Stack,
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Snackbar,
    Alert,
    Typography
} from '@mui/material'
import MessageTutor from 'modals/payment/MessageTutor'
import EnterPaymentForm from './EnterPaymentForm'
import { loadStripe } from '@stripe/stripe-js'
import ConfirmAppointment from './ConfirmAppointment'
import { Elements } from '@stripe/react-stripe-js'
import { PaymentDAO } from 'api/paymentDAO'
import { AppointmentDAO } from 'api/marketplaceDAO'
import { useAuthState } from 'react-firebase-hooks/auth'
import CustomModal from 'components/CustomModal'
import { Auth } from 'modals/login/firebase_auth'
import { PricingInformation } from 'components/HelperComponents'


const stripeKey = (
    window.location.hostname === 'www.shareyourwiz.com'
) ? (
    process.env.REACT_APP_STRIPE_PUBLIC_KEY_PROD
) : (
    process.env.REACT_APP_STRIPE_PUBLIC_KEY_STAGING
)

const stripePromise = loadStripe(stripeKey)

const steps = ['Leave a Message to your Tutor', 'Enter Payment Information', 'Review and Confirm']

export default function ConfirmAppointmentContainer(props) {

    const [activeStep, setActiveStep] = React.useState(0)
    const [clientSecret, setClientSecret] = useState(null)
    const [tutorMessage, settutorMessage] = useState('')
    const [paymentMethodId, setPaymentMethodId] = useState(null)
    const [user, loading] = useAuthState(Auth.auth())
    const [isLoading, setIsLoading] = useState(false)
    const [state, setState] = useState({
        openSnack: false,
        severity: 'success',
        alertMessage: ''
    })

    if (!props.profile || !props.profile.stripe_account_id || !props.profile.account_activated) {
        props.onClose()
    }

    const { openSnack, severity, alertMessage } = state

    useEffect(() => {
        if (loading || !user) return
        PaymentDAO.createSetupIntent({
            user: user.uid,
            onSuccess: (data) => setClientSecret(data.clientSecret),
            onFailure: () => window.location.reload(true)
        })
    }, [user, loading])

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

    const appearance = {
        theme: 'stripe',
    }
    const options = {
        clientSecret: clientSecret,
        appearance: appearance,
    }

    const completed = {}

    const handleBack = () => {
        setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0))
    }

    const handleNext = () => {

        if (activeStep === 2 && tutorMessage !== '' && paymentMethodId) {
            setIsLoading(true)
            AppointmentDAO.tuteeConfirmAppointment({
                user_id: user.uid,
                appointment_id: props.appointment.id,
                message: tutorMessage,
                paymentMethodId: paymentMethodId,
                onSuccess: (mess) => {
                    setIsLoading(false)
                    setState({
                        openSnack: true,
                        severity: 'success',
                        alertMessage: mess
                    })
                    setTimeout(() => props.onClose(), 1000)
                },
                onFailure: (mess) => {
                    setIsLoading(false)
                    setState({
                        openSnack: true,
                        severity: 'error',
                        alertMessage: mess
                    })
                }
            })
        }

        setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length - 1))
    }

    const handleMessageChange = (e) => {
        settutorMessage(e.target.value)
    }

    const handlePaymentValidated = (paymentId) => {
        if (paymentId !== undefined && paymentId) {
            setPaymentMethodId(paymentId)
            setTimeout(() => setActiveStep(2), 1000)
        }
    }

    var nextButtonDisable = () => {
        if (activeStep === 0 && tutorMessage === '') {
            return true
        }

        if (activeStep === 1 && !paymentMethodId) {
            return true
        }

        return false
    }

    var nextButtonText = () => {
        if (isLoading) return <CircularProgress color='inherit' />

        return (activeStep === 2) ? 'Confirm' : 'Next'
    }

    var localDate = new Date(props.appointment['date_time'])
    const date = localDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    const hour = localDate.toLocaleTimeString('en-US')
    const duration = props.appointment.duration
    const amount = Math.max((props.profile.price / 60 * duration).toFixed(2), 1)

    const getStep = (step) => {
        switch (step) {
            case 0:
                return <MessageTutor
                    onChange={handleMessageChange}
                    value={tutorMessage}
                />
            case 1:
                return (
                    clientSecret ? (
                        <Elements options={options} stripe={stripePromise}>
                            <EnterPaymentForm validate={handlePaymentValidated} profileId={props.profile.user} />
                        </Elements>
                    ) : <CircularProgress sx={{ float: 'center' }} />
                )
            case 2:
                return (
                    <ConfirmAppointment
                        appointment={props.appointment}
                        profile={props.profile}
                        amount={amount}
                    />
                )
            default:
                return null
        }
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
        <CustomModal
            open={props.open}
            onClose={props.onClose}>
            <Stepper alternativeLabel activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepLabel color='inherit' >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box  sx={{ padding: { xs: 2, md: 5 }, width: '100%' }}>
                <Typography sx={{pb:2}} align='center'>
                    Appointment with <b>{props.profile.first_name} {props.profile.last_name}</b> <br/>
                    On <b>{date}</b> at <b>{hour}</b> for a duration of <b>{duration} min</b> <br/>
                    with a final amount of <b>${amount}</b>
                </Typography>
                {getStep(activeStep)}

                <Stack
                    direction='row'
                    justifyContent='flex-end'
                    alignItems='center'
                    spacing={2}>
                    <Button
                        variant='contained'
                        onClick={handleBack}
                    >
                        back
                    </Button>
                    <Button
                        variant='contained'
                        disabled={nextButtonDisable()}
                        onClick={handleNext}
                    >
                        {nextButtonText()}
                    </Button>
                    <PricingInformation />
                </Stack>
            </Box>
        </CustomModal>
    </>

}