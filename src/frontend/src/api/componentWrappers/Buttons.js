import React, { useState } from 'react'
import {
    Button,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material'
import { AppointmentDAO } from 'api/marketplaceDAO'
import { PaymentDAO } from 'api/paymentDAO'


function ButtonWithLoading({ children, apiCall, apiArgs, onSuccess, onFailure, ...restProps }) {

    const [loading, setLoading] = useState(false)

    return <Button
        {...restProps}
        onClick={() => {
            setLoading(true)
            apiCall({
                ...apiArgs,
                onSuccess: (res) => {
                    onSuccess(res)
                    setLoading(false)
                },
                onFailure: (res) => {
                    onFailure(res)
                    setLoading(false)
                },
            })
        }}>
        {loading ? <CircularProgress color='inherit' /> : children}
    </Button>
}


function ButtonWithAlert({
    children,
    apiCall,
    apiArgs,
    onSuccess,
    onFailure,
    successMessage,
    ...restProps
}) {

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

    return <>
        <Snackbar
            open={openSnack}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>
        <ButtonWithLoading
            {...restProps}
            apiCall={apiCall}
            apiArgs={apiArgs}
            onSuccess={(res) => {
                setState({
                    openSnack: true,
                    severity: 'success',
                    alertMessage: successMessage
                })
                onSuccess(res)
            }}
            onFailure={(res) => {
                setState({
                    openSnack: true,
                    severity: 'error',
                    alertMessage: 'Oops! Something went wrong!'
                })
                onFailure(res)
            }}
        >
            {children}
        </ButtonWithLoading>
    </>
}

ButtonWithAlert.defaultProps = {
    onFailure: () => { },
}


export function RateAppointmentButton({ onSuccess, appointmentId, rating, ...restProps }) {

    const successMessage = 'This Appointment has been rated'

    return <ButtonWithAlert
        {...restProps}
        apiCall={AppointmentDAO.rateAppointment}
        onSuccess={onSuccess}
        successMessage={successMessage}
        apiArgs={{
            appointmentId: appointmentId,
            rating: rating
        }}>
        Submit
    </ButtonWithAlert>

}


export function ConfirmAppointmentButton({ onSuccess, appointmentId, ...restProps }) {

    const successMessage = 'This Appointment has been confirmed'

    return <ButtonWithAlert
        {...restProps}
        apiCall={PaymentDAO.confirmPayment}
        onSuccess={onSuccess}
        successMessage={successMessage}
        apiArgs={{
            appointmentId: appointmentId,
        }}>
        Confirm
    </ButtonWithAlert>
}


export function CreateAppointmentsButton({ onSuccess, appointments, ...restProps }) {

    const successMessage = appointments.length > 1 ? (
        'The Appointments have been created'
    ) : (
        'The Appointment has been created'
    )

    return <ButtonWithAlert
        {...restProps}
        apiCall={AppointmentDAO.createAppointments}
        onSuccess={onSuccess}
        successMessage={successMessage}
        apiArgs={{
            appointments: appointments,
        }}>
        Create
    </ButtonWithAlert>
}
