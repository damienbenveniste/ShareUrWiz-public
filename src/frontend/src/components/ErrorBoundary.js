import React from 'react'
import {
    Stack,
    Typography
} from '@mui/material'
import { LoggingDAO } from 'api/loggingDAO'
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4'

function FallBackUI() {
    return <Stack
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


export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        LoggingDAO.sendLogs({error: error.toString(), errorInfo: errorInfo['componentStack']})
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <FallBackUI />
        }

        return this.props.children;
    }
}