import React, { useState } from 'react'
import { Auth } from 'modals/login/firebase_auth'
import {
  Stack,
  TextField,
  Button,
  Collapse,
  Alert,
  AlertTitle
} from '@mui/material'


function Reset() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState({
    message: '',
    open: false,
    severity: 'success'
  })

  const titles = {
    success: 'Success',
    error: 'Error'
  }

  return (
    <Stack spacing={1}>
      <TextField
        type='email'
        label='Email Address'
        autoComplete='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        variant='contained'
        color='secondary'
        onClick={() => Auth.sendPasswordResetEmail(
          email,
          (alertMessage) => {
            setState({
              message: alertMessage,
              open: true,
              severity: 'success'
            })
          },
          (alertMessage) => {
            setState({
              message: alertMessage,
              open: true,
              severity: 'error'
            })
          }
        )}
      >
        Send password reset email
      </Button>
      <Collapse in={state.open}>
        <Alert severity={state.severity}>
          <AlertTitle>{titles[state.severity]}</AlertTitle>
          {state.message}
        </Alert>
      </Collapse>
    </Stack>
  )
}
export default Reset