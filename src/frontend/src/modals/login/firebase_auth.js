import firebase from 'firebase/app';
import 'firebase/auth'
import axios from 'axios'
import { getBaseAPI } from 'api/marketplaceDAO'

const firebaseConfig = (window.location.hostname === 'www.shareyourwiz.com') ? (
  {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY_PROD,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN_PROD,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID_PROD,
    storageBucket: process.env.REACT_APP_FIREBASE_BUCKET_PROD,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID_PROD,
    appId: process.env.REACT_APP_FIREBASE_APPID_PROD,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID_PROD
  }
) : (
  {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY_STAGING,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN_STAGING,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID_STAGING,
    storageBucket: process.env.REACT_APP_FIREBASE_BUCKET_STAGING,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID_STAGING,
    appId: process.env.REACT_APP_FIREBASE_APPID_STAGING,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID_STAGING
  }
)

const auth = firebase.initializeApp(firebaseConfig).auth()


class Auth {

  static auth() {
    if (auth) {
      return auth
    } else {
      setTimeout(() => {
        return Auth.auth()
      }, 10)
    }
  }

  static signInWithGoogle(onSuccess, onFaillure) {

    if (!auth) return

    const googleProvider = new firebase.auth.GoogleAuthProvider()

    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        auth.signInWithPopup(googleProvider)
          .then((res) => {

            const user = res.user

            axios.get(`${getBaseAPI()}/login/users/${user.uid}/`)
              .then((res) => {
                if (res.status === 200) {
                  onSuccess('You successfully logged in')
                }
              })
              .catch(() => {
                axios.post(`${getBaseAPI()}/login/users/`, {
                  'id': user.uid,
                  'username': user.displayName,
                  'email': user.email,
                })
                  .then(res => {
                    if (res.status === 201) {
                      onSuccess('You successfully registered')
                    }
                  })
                  .catch((err) => {
                    user.delete().then(() =>
                      onFaillure(err.message)
                    )
                  })
              })
          })
          .catch((err) => {
            onFaillure(err.message)
          })
      })
  }

  static signInWithEmailAndPassword(
    email,
    password,
    onSuccess,
    onFaillure,
  ) {

    if (!auth) return

    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        auth.signInWithEmailAndPassword(email, password)
          .then(() =>
            onSuccess('You are logged in')
          )
          .catch((err) =>
            onFaillure(err.message)
          )
      })
  }

  static registerWithEmailAndPassword(
    name,
    email,
    password,
    onSuccess,
    onFaillure
  ) {


    if (!auth) return

    auth.createUserWithEmailAndPassword(email, password)
      .then((res) => {
        const user = res.user
        axios.post(`${getBaseAPI()}/login/users/`, {
          'id': user.uid,
          'username': name,
          'email': email,
        })
          .then(res => {
            if (res.status === 201) {
              onSuccess('You successfully registered')
            }
          })
          .catch((err) => {
            if (err.response.status === 400) {
              user.delete().then(() =>
                onFaillure(err.message)
              )
            }
          })
      })
      .catch((err) =>
        onFaillure(err.message)
      )
  }

  static sendPasswordResetEmail(
    email,
    onSuccess,
    onFaillure,
  ) {


    if (!auth) return
    auth.sendPasswordResetEmail(email)
      .then(() =>
        onSuccess('Password reset link sent!')
      )
      .catch((err) =>
        onFaillure(err.message)
      )
  }

  static logout(
    onSuccess,
    onFaillure
  ) {

    if (!auth) return
    auth.signOut()
      .then(() =>
        onSuccess('You are logged out')
      )
      .catch((err) =>
        onFaillure(err.message)
      )
  }

  static delete(
    onSuccess,
    onFailure
  ) {
    if (!auth) return

    const user = auth.currentUser
    user.delete().then(
      axios.delete(`${getBaseAPI()}/login/users/${user.uid}`)
      .then(onSuccess)
      .catch(onFailure)
    ).catch(onFailure)

  }
}

export { Auth }

