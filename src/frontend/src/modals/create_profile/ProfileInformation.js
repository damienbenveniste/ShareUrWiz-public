import React, { useEffect } from "react"
import {
    Box,
    Paper,
    Stack,
    Avatar,
    Typography,
    TextField,
    TextareaAutosize,
    InputAdornment
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import CategoryList from 'components/CategoryList'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import validator from 'validator'


export default function ProfileInformation(props) {

    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('md'))

    const validateURL = (value) => {
        if (value) {
            return validator.isURL(value) && value.startsWith('https://www.linkedin.com/')
        }
        return true
    }

    const errorFirstname = props.error && !props.firstName
    const errorLastname = props.error && !props.lastName
    const errorPrice = props.error && (!props.price || Number(props.price) === 0)
    const errorSummary = props.error && !props.summary
    const errorCategories = props.error && !props.categories.length
    const errorURL = props.error && !validateURL(props.linkedInURL)

    const errorFirstnameText = errorFirstname && 'Enter your first name'
    const errorLastnameText = errorLastname && 'Enter your last name'
    const errorPriceText = errorPrice && 'Set a price to get paid'
    const errorSummaryText = errorSummary && 'Tell us about yourself'
    const errorCategoriesText = errorCategories && 'Enter your specialities'
    const errorURLText = errorURL && 'Not a valid LinkedIn URL'

    return (
        <Box>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ display: 'flex' }}
            >
                <input
                    type="file"
                    id="icon-button-file"
                    accept="image/*"
                    hidden
                    onChange={props.selectPicture}
                />
                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    spacing={1}
                >
                    <label htmlFor="icon-button-file">
                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Avatar
                                elevation={3}
                                component={Paper}
                                src={props.photoPreview}
                                sx={{ width: 100, height: 100 }}
                            >
                                <PersonIcon sx={{ width: 90, height: 90 }} />
                            </Avatar>
                            <Typography color='primary' align='center'>
                                Choose a Picture <br/>(optional)
                            </Typography>
                        </Stack>
                    </label>
                    <Stack direction="column" spacing={1}>
                        {mobile ? (
                            <>
                                <TextField
                                    label="First Name"
                                    onChange={props.setFirstName}
                                    value={props.firstName}
                                    error={errorFirstname}
                                    helperText={errorFirstnameText}
                                />
                                <TextField
                                    label="Last Name"
                                    onChange={props.setLastName}
                                    value={props.lastName}
                                    error={errorLastname}
                                    helperText={errorLastnameText}
                                />
                            </>
                        ) : <Stack direction="row" spacing={1}>
                            <TextField
                                label="First Name"
                                onChange={props.setFirstName}
                                value={props.firstName}
                                error={errorFirstname}
                                helperText={errorFirstnameText}
                            />
                            <TextField
                                label="Last Name"
                                onChange={props.setLastName}
                                value={props.lastName}
                                error={errorLastname}
                                helperText={errorLastnameText}
                            />
                        </Stack>}
                        <TextField
                            label="Hourly Rates"
                            type='number'
                            value={props.price}
                            onChange={props.setPrice}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$/hr</InputAdornment>,
                                inputProps: { step: 1, min: 1 }
                            }}
                            sx={{ flex: 'auto' }}
                            error={errorPrice}
                            helperText={errorPriceText}
                        />
                    </Stack>
                </Stack>
                <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    placeholder="Write a Summary"
                    style={errorSummaryText ? { width: '100%', borderColor: 'red' } : { width: '100%' }}
                    value={props.summary}
                    onChange={props.setSummary}
                />
                {errorSummaryText && <Typography variant='caption' color='error' align='left' sx={{ width: '100%' }}>
                    {errorSummaryText}
                </Typography>}
                <CategoryList
                    sx={{ width: '100%' }}
                    freeSolo={true}
                    categories={props.categories}
                    onCategoriesChange={(value) => props.setCategories(value)}
                    error={errorCategories}
                    helperText={errorCategoriesText}
                />
                <TextField
                    type="url"
                    sx={{ width: '100%' }}
                    label="LinkedIn URL (optional)"
                    value={props.linkedInURL}
                    onChange={props.setLinkedInURL}
                    error={errorURL}
                    helperText={errorURLText}
                />
            </Stack>
        </Box>
    )

}