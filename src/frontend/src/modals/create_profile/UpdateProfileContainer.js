import React, { useState } from 'react'
import {
    Stack,
    Button,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material'
import ProfileInformation from 'modals/create_profile/ProfileInformation'
import { TutorProfileDAO } from 'api/marketplaceDAO'
import CustomModal from 'components/CustomModal'
import validator from 'validator'


export default function UpdateProfileContainer(props) {

    const [isLoading, setIsLoading] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [photoPreview, setPhotoPreview] = useState(props.profile.picture)
    const [categories, setCategories] = useState(props.profile.specialties)
    const [firstName, setFirstName] = useState(props.profile.first_name)
    const [lastName, setLastName] = useState(props.profile.last_name)
    const [summary, setSummary] = useState(props.profile.summary)
    const [price, setPrice] = useState(props.profile.price)
    const [linkedInURL, setLinkedInURL] = useState(props.profile.linkedin_url)
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
                <Button
                    variant='contained'
                    onClick={() => {

                        if (firstName && lastName && summary && price && Number(price) !== 0 && categories.length && validateURL(linkedInURL)) {

                            setError(false)
                            setIsLoading(true)
                            TutorProfileDAO.updateProfile({
                                userId: props.profile.user,
                                summary: summary,
                                firstName: firstName,
                                lastName: lastName,
                                picture: photo,
                                price: price,
                                specialties: categories,
                                linkedInUrl: linkedInURL,
                                onSuccess: (res) => {
                                    props.handleUpdateProfile(res.data)
                                    props.onClose()
                                    setIsLoading(false)
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
                    {isLoading ? <CircularProgress color='inherit' /> : 'Update Profile'}
                </Button>
            </Stack>
        </CustomModal>
    </>
}