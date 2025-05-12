
import React, { useState } from 'react'
import { PostDAO } from 'api/marketplaceDAO'
import {
    TextareaAutosize,
    Button,
    TextField,
    Stack,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    InputAdornment,
    CircularProgress,
    Snackbar,
    Alert,
    Typography,
    FormHelperText
} from '@mui/material'
import CategoryList from 'components/CategoryList'
import CustomModal from 'components/CustomModal'


export default function CreateRequest(props) {
    const [level, setLevel] = React.useState('')
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [minPrice, setMinPrice] = React.useState(1)
    const [maxPrice, setMaxPrice] = React.useState(10000)
    const [categories, setCategories] = React.useState([])
    const [loading, setLoading] = React.useState(false)
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

    const handleChange = (event) => {
        setLevel(event.target.value)
    }

    const errorTitle = error && !title
    const errorLevel = error && !level
    const errorDescription = error && !description
    const errorMinPrice = error && !minPrice
    const errorMaxPrice = error && !maxPrice
    const errorCategories = error && !categories.length

    const errorTitleText = errorTitle && 'Enter a Title'
    const errorLevelText = errorLevel && 'What is you current level?'
    const errorDescriptionText = errorDescription && 'Describe what you are looking for'
    const errorMinPriceText = errorMinPrice && 'What is your mininum price?'
    const errorMaxPriceText = errorMaxPrice && 'What is you maximum price?'
    const errorCategoriesText = errorCategories && 'What topics does this post relate to?'

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
            onClose={() => props.onClose(null)}>
            <Stack spacing={2} sx={{ display: 'flex' }}>
                <TextField
                    id='outlined-uncontrolled'
                    label='Title'
                    onChange={(event) => setTitle(event.target.value)}
                    error={errorTitle}
                    helperText={errorTitleText}
                />
                <TextareaAutosize
                    aria-label='minimum height'
                    minRows={5}
                    placeholder='Write your post...'
                    style={errorDescriptionText ? { width: '100%', borderColor: 'red' } : { width: '100%' }}
                    onChange={(event) => setDescription(event.target.value)}
                />
                {errorDescriptionText && <Typography variant='caption' color='error' align='left' sx={{ width: '100%' }}>
                    {errorDescriptionText}
                </Typography>}
                <CategoryList
                    sx={{ width: '100%' }}
                    freeSolo={true}
                    categories={categories}
                    onCategoriesChange={(value) => setCategories(value)}
                    error={errorCategories}
                    helperText={errorCategoriesText}
                />
                <FormControl sx={{ m: 1, minWidth: 120 }} error={errorLevel}>
                    <InputLabel id='demo-simple-select-standard-label'>Level</InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={level}
                        label='Level'
                        onChange={handleChange}
        
                    >
                        <MenuItem value={'Beginner'}>Beginner</MenuItem>
                        <MenuItem value={'Intermediate'}>Intermediate</MenuItem>
                        <MenuItem value={'Advanced'}>Advanced</MenuItem>
                    </Select>
                    {errorLevelText && <FormHelperText>{errorLevelText}</FormHelperText>}
                </FormControl>
                <Stack direction='row' spacing={2} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    flexFlow: 'row'
                }}>
                    <TextField
                        label='Minimum Hourly Price'
                        value={minPrice}
                        type='number'
                        InputProps={{
                            startAdornment: <InputAdornment position='start'>$/hr</InputAdornment>,
                            inputProps: { step: '1', min: 1 }
                        }}
                        sx={{ flex: 'auto' }}
                        onChange={(event) => setMinPrice(event.target.value)}
                        error={errorMinPrice}
                        helperText={errorMinPriceText}
                    />
                    <TextField
                        label='Maximum Hourly Price'
                        type='number'
                        value={maxPrice}
                        InputProps={{
                            startAdornment: <InputAdornment position='start'>$/hr</InputAdornment>,
                            inputProps: { step: '1', min: minPrice + 1 }
                        }}
                        sx={{ flex: 'auto' }}
                        onChange={(event) => setMaxPrice(event.target.value)}
                        error={errorMaxPrice}
                        helperText={errorMaxPriceText}
                    />
                </Stack>
                <Button
                    variant='contained'
                    onClick={() => {

                        if (title && description && minPrice && maxPrice && level && categories.length) {

                            setError(false)
                            setLoading(true)
                            PostDAO.createPost({
                                author: props.user.uid,
                                title: title,
                                description: description,
                                minPrice: minPrice,
                                maxPrice: maxPrice,
                                categories: categories,
                                level: level,
                                onSuccess: ((res, mess) => {
                                    setLoading(false)
                                    setState({
                                        openSnack: true,
                                        severity: 'success',
                                        alertMessage: mess
                                    })
                                    setTimeout(() => props.onClose(res.data), 1000)
                                }),
                                onFailure: (mess) => {
                                    setLoading(false)
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
                    {loading ? <CircularProgress color='inherit' /> : 'Submit'}
                </Button>
            </Stack>
        </CustomModal>
    </>

}