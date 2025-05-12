
import axios from 'axios'
import { getBaseAPI } from 'api/marketplaceDAO'


export class PaymentDAO {

    static createSetupIntent({
        user,
        onSuccess,
        onFailure
    } = {}) {

        axios.get(`${getBaseAPI()}/payment/create-setup-intent/`, { params: { user: user} })
            .then((res) => {
                onSuccess(res.data)
            })
            .catch(onFailure)
    }

    static createAccount({
        user,
        onSuccess,
        onFailure,
    }) {
        axios.get(`${getBaseAPI()}/payment/create-account/`, { params: { user: user } })
            .then((res) => {
                onSuccess(res.data)
            }).catch(onFailure)
    }

    static confirmPayment({
        appointmentId,
        onSuccess,
        onFailure,
    }) {
        axios.get(`${getBaseAPI()}/payment/create-payment-intent/`, {
            params: {
                appointment_id: appointmentId,
            }
        })
            .then((res) => {
                onSuccess(res.data)
            }).catch((res) => {
                const mess = 'Oops something went wrong!'
                onFailure(mess)
            })
    }

    static cancelAppointment({
        appointmentId,
        onSuccess,
        onFailure
    }) {

        axios.delete(`${getBaseAPI()}/payment/create-payment-intent/`, { params: { appointment_id: appointmentId } })
            .then((res) => {
                if (res.status === 200) {
                    const message = 'This Appointment has been cancelled'
                    onSuccess(message)
                } else {
                    const message = 'Oops something went wrong!'
                    onFailure(message)
                }
            })
            .catch(err => {
                const message = 'Oops something went wrong!'
                onFailure(message)
            })
    }

    static getCustomerPortal({
        userId,
        onSuccess,
        onFailure,
    }) {
        axios.get(`${getBaseAPI()}/payment/create-customer-portal-session/`, {
            params: {
                user_id: userId,
            }
        })
            .then((res) => {
                onSuccess(res.data)
            }).catch((res) => {
                const mess = 'Oops something went wrong!'
                onFailure(mess)
            })
    }

}