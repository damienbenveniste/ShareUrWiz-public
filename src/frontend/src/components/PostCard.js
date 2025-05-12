
import React, { useState } from 'react'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardBody from 'components/Card/CardBody'
import {
    Stack,
    Button,
    Typography
} from '@mui/material'


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
        justifyContent='space-between'>
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


export default function PostCard(props) {

    return (
        <Card>
            <CardHeader color='warning'>
                <Stack
                    direction='column'
                    justifyContent='space-between'
                    alignItems='flex-end'>
                    <Typography align='right' variant='h6'>
                        {props.title}
                    </Typography>
                    <Typography align='right' >
                        ${props.min_price} - ${props.max_price}
                    </Typography>
                </Stack>
            </CardHeader>
            <CardBody>
                <Stack spacing={1} >
                    <Typography align='left' sx={{ width: '100%' }} >
                        {props.date} - {props.username} - {props.level}
                    </Typography>
                    <Summary summary={props.description} />
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
                        {props.categories.join(' - ')}
                    </Typography>
                    <div>
                        <Button
                            variant='contained'
                            sx={{ mt: 1, mb: 1, width: 'fit-content', float: 'right' }}
                            onClick={props.onClick}>
                            Suggest your Services
                        </Button>
                    </div>
                </Stack>
            </CardBody>
        </Card>
    )
}