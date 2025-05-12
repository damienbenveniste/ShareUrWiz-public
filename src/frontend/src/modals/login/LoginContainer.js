import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Login from './Login'
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Button,
    Dialog,
    DialogContent
} from '@mui/material'
import Register from './Register'
import Reset from './Reset'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from 'modals/login/firebase_auth'
import CustomModal from 'components/CustomModal'
import { Term } from 'main_views/TermPage'
import { Privacy } from 'main_views/PrivacyPage'



function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function DialogButton({ title, content, ...props }) {

    const [open, setOpen] = useState(false)

    return <>
        <Button
            onClick={() => setOpen(true)}>
            {title}
        </Button>
        <Dialog {...props} open={open} onClose={() => setOpen(false)}>
            <DialogContent>
                {content}
            </DialogContent>
        </Dialog>
    </>
}


export default function LoginContainer(props) {
    const [value, setValue] = React.useState(0)
    const [user, loading] = useAuthState(Auth.auth())

    useEffect(() => {
        if (loading) {
            return
        }
        if (user) {
            props.onClose()
        }
    }, [user, loading])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <CustomModal
            open={props.open}
            onClose={props.onClose}>
            <Typography align='center'>
                Let's set up your account first
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} >
                    <Tab label='Login' value={0} />
                    <Tab label='Register' value={1} />
                    <Tab label='Forgot Password' value={2} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Login
                    next={props.next}
                    profile={props.profile}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Register
                    next={props.next}
                    profile={props.profile}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Reset />
            </TabPanel>
            <DialogButton
                title='Privacy'
                content={<Privacy />}
            />
            <DialogButton
                title='Term and Condition'
                content={<Term />}
            />
        </CustomModal>
    )
}