import React, { useState } from 'react'
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Stack,
    TextField
} from '@mui/material'
import ProfileInformation from 'modals/create_profile/ProfileInformation'
import { TutorProfileDAO } from 'api/marketplaceDAO'
import Constant from 'utils/constants'
import { useHistory } from 'react-router-dom'
import CustomModal from 'components/CustomModal'
import validator from 'validator'
import { CreditInformation } from 'components/HelperComponents'


const steps = ['Enter your Profile Information', 'Enter Banking Information']


export default function CreateProfileContainer(props) {

    const [isLoading, setIsLoading] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [categories, setCategories] = useState([])
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [summary, setSummary] = useState('')
    const [price, setPrice] = useState(0)
    const [promocode, setPromocode] = useState('')
    const [linkedInURL, setLinkedInURL] = useState('')
    const [error, setError] = useState(false)

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

    const validateURL = (value) => {
        if (value) {
            return validator.isURL(value) && value.startsWith('https://www.linkedin.com/')
        }
        return true
    }

    const history = useHistory()

    const selectPicture = (event) => {
        setPhotoPreview(URL.createObjectURL(event.target.files[0]))
        setPhoto(event.target.files[0])
    }

    const getFirstName = (event) => {
        setFirstName(event.target.value)
    }

    const getLastName = (event) => {
        setLastName(event.target.value)
    }

    const getSummary = (event) => {
        setSummary(event.target.value)
    }

    const getPrice = (event) => {
        if (event.target.value) {
            const priceInt = Math.trunc(Number(event.target.value))
            setPrice(priceInt)
        } else {
            setPrice(event.target.value)
        }
    }

    const getLinkedInURL = (event) => {
        setLinkedInURL(event.target.value)
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
            <Stack spacing={2} sx={{ display: 'flex', width: '100%' }}>
                <Stepper alternativeLabel >
                    {steps.map((label) => (
                        <Step key={label} >
                            <StepLabel color='inherit' >
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <ProfileInformation
                    photoPreview={photoPreview}
                    firstName={firstName}
                    lastName={lastName}
                    summary={summary}
                    price={price}
                    categories={categories}
                    linkedInURL={linkedInURL}
                    error={error}
                    selectPicture={selectPicture}
                    setCategories={setCategories}
                    setFirstName={getFirstName}
                    setLastName={getLastName}
                    setSummary={getSummary}
                    setPrice={getPrice}
                    setLinkedInURL={getLinkedInURL}
                />
                <Stack direction='row' spacing={1} sx={{ width: '100%' }}>
                    <TextField
                        sx={{ width: '100%' }}
                        label="Promotion code"
                        onChange={(e) => setPromocode(e.target.value)}
                        value={promocode}
                    />
                    <CreditInformation />
                </Stack>
                <Button
                    variant='contained'
                    color='secondary'
                    sx={{ width: '100%' }}
                    onClick={() => {

                        if (firstName && lastName && summary && price && Number(price) !== 0 && categories.length && validateURL(linkedInURL)) {
                            setError(false)
                            setIsLoading(true)

                            TutorProfileDAO.createProfile({
                                userId: props.userId,
                                summary: summary,
                                firstName: firstName,
                                lastName: lastName,
                                picture: photo,
                                price: price,
                                specialties: categories,
                                linkedInUrl: linkedInURL,
                                promocode: promocode,
                                onSuccess: (res) => {
                                    setIsLoading(false)
                                    if (res.status === 208) {
                                        history.push(Constant.URL.PROFILE_PAGE)
                                        props.onClose()
                                    } else if (res.status === 201) {
                                        window.location.href = res.data.url
                                    }
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
                        } else {
                            setError(true)
                        }

                    }}
                >
                    {isLoading ? <CircularProgress color='inherit' /> : 'Enter your Banking Information'}
                </Button>
            </Stack>
        </CustomModal>
    </>
}