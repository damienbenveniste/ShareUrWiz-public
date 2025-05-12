import React from 'react'
import DialogIconButton from 'components/DialogIconButton'
import HelpIcon from '@mui/icons-material/Help'
import { Typography, Stack, Link } from '@mui/material'


const pricingPolicy = <Typography align='justify'>
    The amount due for an appointment is directly paid by the Tutee to the Tutor.
    Shareyourwiz is charging a 10% fee of the total amount to the Tutor to cover the cost of operation. On top of our fee,
    Stripe (our payment partner <Link href='https://stripe.com/pricing' target="_blank" rel="noopener noreferrer">https://stripe.com/pricing</Link>)
    charges an additional fee of 2.9% + 30¢ (+1% for non-US card).<br /><br />

    Example: Let's assume that Mark (the Tutee) owns $100 to Julie (the Tutor) for a tutoring session:<br />
    - Mark pays $100<br />
    - Shareyourwiz charges a fee of $100 x 10% = $10<br />
    - Stripe charges a fee of $100 x 2.9% + 30¢ = $3.20<br />
    - Julie is finally paid $100 - $10 - $3.20 = $86.80<br /><br />

    To calculate the total amount due for the appointment, we simply need to look at the duration of the appointment
    and the hourly fees of the Tutor. The cost is calculated as:<br /><br />

    the duration in minutes x the Tutor's hourly fees / the number of minutes in 1 hour (= 60 min)<br /><br />

    with a minimum amount charged of $1.<br /><br />

    Example: Let's assume that Julie's hourly fees are $30 and that she set up a 40 min appoinment.<br />
    - The cost for this appointment will be ($30 / 60 min) x 40 min = $20
</Typography>


export function PricingInformation() {
    return <DialogIconButton
        icon={<HelpIcon />}
        title='Pricing Policy'
        text={pricingPolicy} />
}

const suggestionText = <Typography align='justify'>
    We want to make sure our users receive the best service! Do not hesitate to provide us with suggestions that would make the use
    of the platform easier for you. We appreciate you taking the time to help us grow. Thank you!
</Typography>


export function SuggestionInformation() {
    return <DialogIconButton
        icon={<HelpIcon />}
        title='Suggestions'
        text={suggestionText} />
}


const tutorText = <Typography align='justify'>
    Anybody can become a Tutor! If you know something, anything, just get paid to teach it. When you create
    your Tutor profile, you will be provide information about your specialties and hourly rate. For you to get paid,
    we partner with <Link href='https://stripe.com/' target="_blank" rel="noopener noreferrer">Stripe</Link> that will help you
    connect your banking information.<br /><br />

    After that you will be able to set up your schedule and start tutoring tutees.
</Typography>


export function TutorInformation() {
    return <DialogIconButton
        icon={<HelpIcon />}
        title='Become a Tutor'
        text={tutorText} />
}


const tutoringRequestText = <Typography align='justify'>
    If you need a Tutor, you can post a specific request here. Just provide enough details for the right Tutor to find your request.
</Typography>


export function TutoringInformation() {
    return <DialogIconButton
        icon={<HelpIcon />}
        title='Tutoring Request'
        text={tutoringRequestText} />
}


const refundText = <Typography align='justify'>
    When a Tutee books an Appointment with a Tutor, there can be different conditions in which the Appointment is cancelled:<br />
    <ul>
        <li> As long as the Tutor did not confirm the Appointment, both the Tutor and the Tutee can cancel the Appointment at no charge</li>

        <li>After the Tutor confirms the Appointment, the Tutor can cancel the appointment at any time before the time of the appointment.
            When the appointment is cancelled, the full amount of the transaction is refunded minus a transaction fee. Since, the refund is initiated by the
            Tutor, the Tutor incurs a balance equal to the transaction fee and the Tutee incurs a credit equal to the transaction fee. Those balance and
            credit will be applied in future transactions. The transaction fees are 2.9% + 30¢ (+1% for non-US card)
        </li>

        <li>As soon as the Tutor confirms the Appointment, the Tutee <b>cannot</b> cancel the Appointment and no refund can be initiated
            by the Tutee from the Shareyourwiz platform (this will change in the future). The Tutee can however agree with the Tutor for the
            Tutor to refund the payment from his/her end. If the Tutor cancels the Appointment after confirming and refunds the payment, a transaction
            balance is applied to the Tutor's account (this will change in the future) and a credit is applied to the Tutee's account. The transaction fees
            are 2.9% + 30¢ (+1% for non-US card)</li>

        <li>Example: Let's assume that Mark (the Tutee) booked a tutoring session with Julie (the Tutor) for $100:<br />
            - Julie did not yet confirm and Mark cancels the Appointment: no charge is applied and Mark recovers the full payment amount.
            - Julie confimed but she realized later that she cannot be available during that time: in that situation, transactions fees apply.
            The transaction fee is $100 x 2.9% + 30¢ = $3.20. Mark is refunded $100 - $3.20 = $96.80 and receives a credit of $3.20 to be applied
            anytime on the platform. Julie will receive no payment and is applied a balance of $3.20 that will be collected as fees from the next payment.
        </li>
    </ul>
</Typography>


export function RefundInformation() {
    return <DialogIconButton
        icon={<HelpIcon />}
        title='Refund Policy'
        text={refundText} />
}


const creditText = <Typography align='justify'>
    When credit is applied to your account, it will be automatically used when an appointment is purchased from you..<br /><br />

    Example: Let's assume that Mark (the Tutee) owns $100 to Julie (the Tutor) for a tutoring session. Julie owns $100
    in credit:<br />
    - Mark pays $100<br />
    - Shareyourwiz charges a fee of $100 x 10% = $10<br />
    - Julie's credit is applied and the fee is reduced to $0 and $90 remains in credit for Julie
    - Stripe charges a fee of $100 x 2.9% + 30¢ = $3.20<br />
    - Julie is finally paid $100 - $3.20 = $96.80<br />
</Typography>


export function CreditInformation() {
    return <DialogIconButton
        icon={<HelpIcon />}
        title='Credit Policy'
        text={creditText} />
}


