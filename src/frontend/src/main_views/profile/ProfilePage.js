import React from 'react'
import { Auth } from 'modals/login/firebase_auth'
import { UserDAO } from 'api/marketplaceDAO'
import {
    CircularProgress,
} from '@mui/material'
import Constant from 'utils/constants'
import TutorProfilePage from './TutorProfilePage'
import UserProfilePage from './UserProfilePage'


export default class ProfilePage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null,
        }
    }

    componentDidMount() {
        Auth.auth().onAuthStateChanged((user) => {
            if (user) {
                UserDAO.getUser({
                    userId: user.uid,
                    onSuccess: (res) => this.setState({ user: res }),
                    onFailure: (mess) => {
                        this.props.history.replace(Constant.URL.ROOT)
                    }
                })
            }
        })
    }

    render() {
        return (this.state.user ? (
            this.state.user.tutor ? <TutorProfilePage /> : <UserProfilePage />
        ) : <CircularProgress />
        )
    }
}