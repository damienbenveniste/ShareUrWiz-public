import React from 'react'
import {
    DialogContent,
    Button,
    Dialog
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import ErrorBoundary from 'components/ErrorBoundary'

export default function CustomModal({ children, ...props }) {

    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md')) || props.fullScreen

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            fullScreen={fullScreen}
            maxWidth={false}
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <DialogContent sx={{padding: {xs: 2, md: 5}}}>
                <Button
                    startIcon={<CloseIcon />}
                    onClick={props.onClose}>
                    Close
                </Button>
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </DialogContent>
        </Dialog>
    )
}

CustomModal.defaultProps = {
    fullScreen: false,
}