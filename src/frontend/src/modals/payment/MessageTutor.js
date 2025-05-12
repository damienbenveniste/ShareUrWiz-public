
import React from 'react'
import {
    Typography,
    Box,
    TextareaAutosize
} from '@mui/material'


export default function MessageTutor(props) {
    return (
        <Box>
            <Typography align='center'>
                Leave a message to your tutor to explain what you are looking for:
            </Typography>
            <TextareaAutosize
                maxRows={10}
                minRows={5}
                value={props.value}
                aria-label='maximum height'
                placeholder='What are you looking for?'
                style={{ width: '100%' }}
                onChange={props.onChange}
            />
        </Box>
    )
}