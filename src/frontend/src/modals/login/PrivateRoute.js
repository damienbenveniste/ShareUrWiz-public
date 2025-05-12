// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import CircularProgress from '@mui/material/CircularProgress'
import { Auth } from 'modals/login/firebase_auth'
import Constant from 'utils/constants'

const PrivateRoute = ({ component: Component, ...rest }) => {

    // Add your own authentication on the below line.
    const [user, loading] = useAuthState(Auth.auth())

    return (
        <Route
            {...rest}
            render={props =>
                loading ? (
                    <CircularProgress />
                ) : (
                    user ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to={{ pathname: Constant.URL.ROOT, state: { from: props.location } }} />
                    )
                )
            }
        />
    )
}

export default PrivateRoute