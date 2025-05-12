import React, { useState } from 'react'

import {
  Box,
  Button,
  TextareaAutosize,
  Stack,
  Snackbar,
  Alert
} from '@mui/material'
import { Link } from 'react-router-dom'
import Constant from 'utils/constants'
import { SuggestionDAO } from 'api/marketplaceDAO'
import { SuggestionInformation } from 'components/HelperComponents'

export default function OtherLinks(props) {

  const [content, setContent] = useState('')
  const [state, setState] = useState({
    open: false,
    severity: 'success',
    message: ''
  })

  const { open, severity, message } = state

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setState({
      open: false,
      severity: 'success',
      message: ''
    })
  }

  return <>
    {open && <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>}
    <Stack spacing={1} sx={{ mt: 2 }}>
      <TextareaAutosize
        minRows={7}
        placeholder="Write a Suggestion"
        style={{ width: '100%' }}
        onChange={(e) => setContent(e.target.value)} />
      <Stack
        direction='row'
        justifyContent='flex-end'
        alignItems='center'
        spacing={1}>
        <Button
          variant='contained'
          sx={{ width: '100%' }}
          onClick={() => {
            if (content !== '') {
              SuggestionDAO.createSuggestion(
                content,
                (mes) => {
                  setContent('')
                  setState({
                    open: true,
                    severity: 'success',
                    message: mes
                  })
                },
                (errorMes) => {
                  setContent('')
                  setState({
                    open: true,
                    severity: 'error',
                    message: errorMes
                  })
                }
              )
            }
          }}>
          Submit
        </Button>
        <SuggestionInformation />
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          typography: 'body1',
          '& > :not(style) + :not(style)': {
            ml: 2,
          },
        }}
      >
        <Link to={Constant.URL.ABOUT_PAGE} style={{ textDecoration: 'none' }}>
          About
        </Link>
        <Link to={Constant.URL.PRIVACY_PAGE} style={{ textDecoration: 'none' }}>
          Privacy
        </Link>
        <Link to={Constant.URL.TERM_PAGE} style={{ textDecoration: 'none' }}>
          Term and Conditions
        </Link>
      </Box>
    </Stack>
  </>

}