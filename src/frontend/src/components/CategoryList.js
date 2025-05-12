import React from 'react'
import { CategoryDAO } from 'api/marketplaceDAO'
import {
    TextField,
    Autocomplete,
    CircularProgress,
    Collapse,
    Alert,
    AlertTitle
} from '@mui/material'


export default function CategoryList({ onCategoriesChange, error, helperText, ...props }) {
    const [open, setOpen] = React.useState(false)
    const [options, setOptions] = React.useState([])
    const [failureState, setFailureState] = React.useState({
        message: '',
        alertOpen: false,
    })
    const loading = open && options.length === 0
    const { message, alertOpen } = failureState

    React.useEffect(() => {

        if (!loading) {
            return undefined
        }

        CategoryDAO.getAllCateggories({
            onSuccess: ((res) => {
                setOptions(res.data.map((category) => category.name))
            }),
            onFailure: (mess) => {
                setFailureState({
                    message: mess,
                    alertOpen: true
                })
                setTimeout(() => {
                    setFailureState({
                        message: '',
                        alertOpen: false
                    })
                }, 2000)
            }
        })

    }, [loading])

    return <>
        <Autocomplete
            {...props}
            multiple
            value={props.categories}
            filterSelectedOptions
            autoComplete={true}
            open={open}
            onOpen={() => {
                setOpen(true)
            }}
            onClose={() => {
                setOpen(false)
            }}
            freeSolo={props.freeSolo}
            loading={loading}
            options={options}
            onChange={(event, value, reason, details) => onCategoriesChange(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.freeSolo ? (
                        'Select or create tutoring categories'
                    ) : (
                        'Select tutoring categories'
                    )}
                    placeholder='Tutoring Categories'
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                    error={error}
                    helperText={helperText}
                />
            )}
        />
        <Collapse in={alertOpen}>
            <Alert severity='error'>
                <AlertTitle>Error</AlertTitle>
                {message}
            </Alert>
        </Collapse>
    </>
}