
import React, { useState } from 'react'
import Card from 'components/Card/Card'

import CardHeader from 'components/Card/CardHeader'
import CardBody from 'components/Card/CardBody'
import {
    Avatar,
    Typography,
    Rating,
    Stack,
    Grid,
    Box,
    Button
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'


function Summary(props) {

    const [noWrap, setNoWrap] = useState(true)
    const [summaryButtonText, setSummaryButtonText] = useState('more')

    const onClick = () => {
        const text = noWrap ? 'less' : 'more'
        setNoWrap(!noWrap)
        setSummaryButtonText(text)
    }

    return <Stack
        alignItems='flex-end'
        direction={noWrap ? 'row' : 'column'}
        justifyContent='space-between'
    >
        {noWrap ? <Typography
            noWrap={true}
            align='justify'
            gutterBottom>
            {props.summary}
        </Typography> : <Typography
            noWrap={false}
            sx={{ whiteSpace: 'pre-line' }}
            align='justify'
            gutterBottom>
            {props.summary}
        </Typography>}
        <Button sx={{ textTransform: 'none' }} onClick={onClick}>
            {summaryButtonText}
        </Button>
    </Stack>
}


export default function ProfileCard(props) {

    return (
        <Card style={{ heigh: '200' }}>
            <CardHeader color='warning' sx={{ minHeight: '50px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} md={4} />
                    <Grid item xs={8} md={8}>
                        <Typography align='right' variant='h6'>
                            {props.firstName} {props.lastName}
                        </Typography>
                        <Typography align='right'>
                            ${props.price} / hr
                        </Typography>
                    </Grid>
                </Grid>
            </CardHeader>
            <CardBody>
                <Grid container spacing={2}>
                    <Grid item xs={4} md={4}>
                        <Avatar
                            src={props.picture}
                            srcSet={`${props.picture}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={props.first_name}
                            sx={{ width: 100, height: 100, marginTop: '-55px' }}
                        >
                            <PersonIcon sx={{ width: 100, height: 100 }} />
                        </Avatar>
                    </Grid>
                    <Grid item xs={8} md={8} >
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, float: 'right', verticalAlign: 'middle' }}>
                            <Typography sx={{ mr: 1 }} >
                                {props.rating.toFixed(1)}
                            </Typography>
                            <Rating
                                value={props.rating}
                                precision={1}
                                readOnly
                            />

                            <Typography sx={{ ml: 1 }} >
                                {props.numRating}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Summary summary={props.summary} />
                        <Typography
                            align='right'
                            variant='caption'
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                            }}
                        >
                            {props.specialties.join(' - ')}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12} sx={{ float: 'right' }}>
                    <Button
                        variant='contained'
                        sx={{ mt: 1, mb: 1 }}
                        onClick={props.onClick}>
                        Take an Appointment
                    </Button>
                </Grid>
            </CardBody>
        </Card>
    )
}