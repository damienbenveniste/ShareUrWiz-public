import React, { useEffect, useState } from 'react'
import {
  Stack,
  Button,
  TextField,
  Alert,
  Collapse,
  AlertTitle
} from '@mui/material'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from 'modals/login/firebase_auth'

function Register(props) {
  const [user, loading] = useAuthState(Auth.auth())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setName] = useState('')
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
    if (loading) {
      return
    }
  }, [user, loading])

  useEffect(() => {
    return () => {
      setState({})
    }
  }, [])

  const register = () => {
    if (!username) {
      setState({
        message: 'Enter a Username',
        open: true,
        severity: 'error'
      })
      return
    }
    Auth.registerWithEmailAndPassword(
      username,
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
    )
  }

  return (
    <Stack spacing={1}>
      <TextField
        type='text'
        label='Username'
        value={username}
        autoComplete='name'
        onChange={(e) => setName(e.target.value)}
        placeholder='Username'
      />
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
        onClick={register}
      >
        Register
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
        Register with Google
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
export default Register