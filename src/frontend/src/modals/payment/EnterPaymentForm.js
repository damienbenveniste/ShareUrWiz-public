
import React, { useState } from 'react'
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'
import {
    Button,
    Alert,
    Collapse,
    CircularProgress
} from '@mui/material'


export default function EnterPaymentForm(props) {
    const stripe = useStripe()
    const elements = useElements()

    const [message, setMessage] = useState(null)
    const [severity, setSeverity] = useState('success')
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const returnURL = `${window.location.protocol}//${window.location.host}/tutor-profile/${props.profileId}`

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault()

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return
        }

        setIsLoading(true)

        // transform with then https://stripe.com/docs/js/payment_intents/confirm_payment
        stripe.confirmSetup({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: returnURL,
            },
            redirect: 'if_required'
        }).then((results) => {

            if (results.error) {
                // This point will only be reached if there is an immediate error when
                // confirming the payment. Show error to your customer (e.g., payment
                // details incomplete)
                setMessage(results.error.message)
                setSeverity('error')
                setOpen(true)

            } else if (results.setupIntent) {
                // Your customer will be redirected to your `return_url`. For some payment
                // methods like iDEAL, your customer will be redirected to an intermediate
                // site first to authorize the payment, then redirected to the `return_url`.
                switch (results.setupIntent.status) {
                    case 'succeeded':
                      setSeverity('success')
                      setOpen(true)
                      props.validate(results.setupIntent.payment_method)
                      setMessage('Success! Your payment method has been saved.');
                      break;
          
                    case 'processing':
                      setSeverity('success')
                      setOpen(true)
                      props.validate(results.setupIntent.payment_method)
                      setMessage("Processing payment details. We'll update you when processing is complete.");
                      break;
          
                    case 'requires_payment_method':
                      // Redirect your user back to your payment page to attempt collecting
                      // payment again
                      setSeverity('error')
                      setOpen(true)
                      setMessage('Failed to process payment details. Please try another payment method.');
                      break;

                    default:
                        setSeverity('error')
                        setOpen(true)
                        setMessage('Oops! Something went wrong');
                        return null
                  }
            }
            setIsLoading(false)
        })
    }

    return (
        <form id='payment-form' onSubmit={handleSubmit}>
            <PaymentElement id='payment-element' />
            <Button
                disabled={isLoading || !stripe || !elements}
                id='submit'
                type='submit'
                variant='contained'
                sx={{ mt: 2, mb: 2, width: '100%' }}
            >
                {isLoading ? <CircularProgress color='inherit' /> : 'Submit Payment Information'}
            </Button>
            <Collapse in={open}>
                <Alert severity={severity}>
                    {message}
                </Alert>
            </Collapse>
        </form>
    )
}