import React, { useState, useEffect } from 'react'
import { Auth } from 'modals/login/firebase_auth'
import {
  TextField,
  Stack,
  Alert,
  AlertTitle,
  Collapse,
  Button
} from '@mui/material'
import { useAuthState } from 'react-firebase-hooks/auth'


function Login(props) {
  const [user, loading] = useAuthState(Auth.auth())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState({
    message: '',
    open: false,
    severity: 'success'
  })

  const titles = {
    success: 'Success',
    error: 'Error'
  }

  useEffect(() => {
    return () => {
      setState({})
    }
  }, [])

  useEffect(() => {
    if (loading) {
      return
    }
  }, [user, loading])

  return (
    <Stack spacing={1}>
      <TextField
        type='email'
        label='Email Address'
        autoComplete='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        type='password'
        label='Password'
        autoComplete='current-password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant='contained'
        color='secondary'
        onClick={() => Auth.signInWithEmailAndPassword(
          email,
          password,
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
        Login
      </Button>
      <Button
        variant='contained'
        onClick={() => Auth.signInWithGoogle(
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
        )}>
        Login with Google
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
export default Login