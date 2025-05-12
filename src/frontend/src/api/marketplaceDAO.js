import axios from 'axios'


export function getBaseAPI({ remove_http = false } = {}) {

    var BASE_API = null
    if (window.location.hostname === 'www.shareyourwiz.com') {
        BASE_API = 'https://api.shareyourwiz.com:443'
    } else if (window.location.hostname === 'staging.1234.shareyourwiz.com') {
        BASE_API = 'https://api.staging.1234.shareyourwiz.com:443'
    } else if (window.location.hostname === 'localhost') {
        BASE_API = 'http://localhost:8000'
        // BASE_API = 'https://api.staging.1234.shareyourwiz.com:443'
    }

    if (remove_http) {
        const arr = BASE_API.split('/')
        BASE_API = arr[arr.length - 1]
    }

    return BASE_API
}

export class SuggestionDAO {

    static createSuggestion(
        content,
        onSuccess,
        onFailure
    ) {
        axios.post(`${getBaseAPI()}/login/suggestions/`, { 'content': content })
            .then((res) => {
                if (res.status === 201) {
                    const message = 'Thank you for your suggestion!'
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
}

export class CategoryDAO {

    static getAllCateggories({
        onSuccess,
        onFailure
    }) {

        axios.get(`${getBaseAPI()}/marketplace/categories/`)
            .then((res) => {
                if (res.status === 200) {
                    onSuccess(res)
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
}

export class UserDAO {

    static getUser({
        userId,
        onSuccess,
        onFailure
    }) {

        axios.get(`${getBaseAPI()}/login/users/${userId}`)
            .then((res) => {
                if (res.status === 200) {
                    onSuccess(res.data)
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

}


export class PostDAO {

    static getPosts({
        page,
        categories = new Set(),
        selectedLevels = new Set(),
        minPrice = null,
        maxPrice = null,
        onSuccess,
        onFailure
    } = {}) {

        const params = {}
        if (categories) params['categories'] = categories
        if (selectedLevels.size !== 0) params['levels'] = Array.from(selectedLevels)
        params['min_price'] = minPrice
        params['max_price'] = maxPrice

        axios
            .get(`${getBaseAPI()}/marketplace/posts/?page=${page}`, { params: params, arrayFormat: 'bracket' })
            .then((res) => {
                if (res.status === 200) {
                    onSuccess(res)
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

    static createPost({
        author,
        title,
        description,
        categories,
        level,
        minPrice,
        maxPrice,
        onSuccess,
        onFailure
    }) {

        axios.post(`${getBaseAPI()}/marketplace/posts/`, {
            'title': title,
            'description': description,
            'categories': categories,
            'author_id': author,
            'min_price': minPrice,
            'max_price': maxPrice,
            'level': level,
        }).then((res) => {
            if (res.status === 201) {
                const message = 'Your post has been created'
                onSuccess(res, message)
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
}


export class TutorProfileDAO {

    static getProfile(
        profileId,
        onSuccess,
        onFailure
    ) {
        axios.get(`${getBaseAPI()}/marketplace/tutors/${profileId}`)
        .then((res) => {
            if (res.status === 200) {
                onSuccess(res)
            } else {
                onFailure()
            }
        })
        .catch(err => onFailure())
    }

    static createProfile({
        userId,
        summary,
        firstName,
        lastName,
        picture,
        price,
        specialties,
        linkedInUrl,
        promocode,
        onSuccess,
        onFailure
    }) {

        let form_data = new FormData()
        form_data.append('user', userId)
        if (firstName) form_data.append('first_name', firstName)
        if (lastName) form_data.append('last_name', lastName)
        if (summary) form_data.append('summary', summary)
        if (picture) form_data.append('picture', picture, picture.name)
        if (promocode) form_data.append('promocode', promocode)
        if (price) form_data.append('price', Math.trunc(Number(price)))
        if (linkedInUrl) form_data.append('linkedin_url', linkedInUrl)

        for (let specialty of specialties) {
            form_data.append('specialties', specialty)
        }

        axios.post(`${getBaseAPI()}/marketplace/tutors/`, form_data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then(onSuccess)
        .catch(err => {
            const message = 'Oops something went wrong!'
            onFailure(message)
        })
    }

    static updateProfile({
        userId,
        summary,
        firstName,
        lastName,
        picture,
        price,
        specialties,
        linkedInUrl,
        onSuccess,
        onFailure
    }) {

        let form_data = new FormData()
        if (firstName) form_data.append('first_name', firstName)
        if (lastName) form_data.append('last_name', lastName)
        if (summary) form_data.append('summary', summary)
        if (picture) form_data.append('picture', picture, picture.name)
        if (price) form_data.append('price', Math.trunc(Number(price)))
        if (linkedInUrl) form_data.append('linkedin_url', linkedInUrl)

        for (let specialty of specialties) {
            form_data.append('specialties', specialty)
        }

        axios.patch(`${getBaseAPI()}/marketplace/tutors/${userId}/`, form_data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.status === 200) {
                onSuccess(res)
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

    static getProfiles({
        page,
        categories = [],
        minPrice = null,
        maxPrice = null,
        timeStart = null,
        timeEnd = null,
        onSuccess,
        onFailure
    } = {}) {

        const params = {}
        if (categories) params['categories'] = categories
        if (minPrice !== null) params['min_price'] = minPrice
        if (maxPrice !== null) params['max_price'] = maxPrice
        if (timeStart) params['timeStart'] = timeStart
        if (timeEnd) params['timeEnd'] = timeEnd

        axios
            .get(`${getBaseAPI()}/marketplace/tutors/?page=${page}`, { params: params })
            .then((res) => {
                if (res.status === 200) {
                    onSuccess(res)
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

    static getAvailableAppointments({
        profile,
        date,
        onSuccess,
        onFailure
    } = {}) {

        const params = {
            tutor: profile.user,
            date: date,
            available: true
        }

        axios
            .get(`${getBaseAPI()}/marketplace/appointments/`, { params: params })
            .then((res) => {
                if (res.status === 200) {
                    onSuccess(res.data.results)
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
}


export class AppointmentDAO {

    static tuteeConfirmAppointment({
        message,
        user_id,
        appointment_id,
        paymentMethodId,
        onSuccess,
        onFailure
    } = {}) {

        const params = {
            user_id: user_id,
            message: message,
            appointment_id: appointment_id,
            payment_method_id: paymentMethodId
        }

        axios
            .put(`${getBaseAPI()}/marketplace/confirm-appointment/`, params)
            .then((res) => {
                if (res.status === 200) {
                    const message = 'Your Appointment is booked'
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

    static getAppointmentInRange({
        userId,
        isTutor,
        startDate,
        endDate,
        onSuccess,
        onFailure
    }){
        const params = isTutor ? { tutor: userId } : { tutee: userId }
        params['startDate'] = startDate
        params['endDate'] = endDate

        axios
            .get(`${getBaseAPI()}/marketplace/appointments-calendar/?page=1`, { params: params })
            .then((res) => {
                if (res.status === 200) {
                    onSuccess(res.data.results)
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

    static createAppointments({
        appointments,
        onSuccess,
        onFailure
    } = {}) {

        axios
            .post(`${getBaseAPI()}/marketplace/appointments/`, appointments)
            .then((res) => {
                if (res.status === 201) {
                    const message = 'Appointments were saved'
                    onSuccess(res.data, message)
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

    static getAllAppointments({
        user_id,
        isTutor,
        date,
        future,
        page,
        status=null,
        onSuccess,
        onFailure
    }) {

        const params = isTutor ? { tutor: user_id } : { tutee: user_id }
        if (status) params['status'] = status
        params['date'] = date
        params['future'] = future

        axios
            .get(`${getBaseAPI()}/marketplace/appointments-list/?page=${page}`, { params: params })
            .then((res) => {
                if (res.status === 200) {
                    onSuccess(res.data)
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

    static getFutureAppointments({
        tutorId,
        date,
        page,
        onSuccess,
        onFailure
    } = {}) {

        const params = {
            tutor: tutorId,
            date: date,
            available: false
        }

        axios
            .get(`${getBaseAPI()}/marketplace/appointments/?page=${page}`, { params: params })
            .then((res) => {
                if (res.status === 200) {
                    onSuccess(res)
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

    static cancelAppointment({
        appointmentId,
        onSuccess,
        onFailure
    }) {

        axios.patch(`${getBaseAPI()}/marketplace/appointments/${appointmentId}/`, { 'tutee': null })
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

    static rateAppointment({
        appointmentId,
        rating,
        onSuccess,
        onFailure
    }) {

        axios.patch(`${getBaseAPI()}/marketplace/appointments/${appointmentId}/`, { 'rating': rating })
            .then((res) => {
                if (res.status === 200) {
                    const message = 'This Appointment has been rated'
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

    static deleteAppointment({
        appointmentId,
        onSuccess,
        onFailure
    }) {

        axios.delete(`${getBaseAPI()}/marketplace/appointments/${appointmentId}/`)
            .then((res) => {
                if (res.status === 204) {
                    const message = 'This Appointment has been deleted'
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

    static getAppointment({
        appointmentId,
        onSuccess,
        onFailure
    }) {

        axios.get(`${getBaseAPI()}/marketplace/appointments/${appointmentId}/`)
            .then((res) => {
                if (res.status === 200) {
                    onSuccess(res)
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

}


