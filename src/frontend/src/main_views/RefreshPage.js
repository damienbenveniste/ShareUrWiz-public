
import React, { useEffect } from 'react'
import { PaymentDAO } from 'api/paymentDAO'
import { useHistory } from 'react-router'
import Constant from 'utils/constants'
import { CircularProgress } from '@mui/material'

export default function RefreshPage(props) {

    const history = useHistory()

    console.log(props.match.params.userId)

    useEffect(() => {
        PaymentDAO.createAccount({
            user: props.match.params.userId,
            onSuccess: (res) => {
                console.log(res)
                if ('url' in res) {
                    window.location.href = res.url
                } else {
                    history.replace(Constant.URL.ROOT)
                }
            },
            onFailure: () => {
                history.replace(Constant.URL.ROOT)
            }
        })
    }, [])

    return <CircularProgress />
}