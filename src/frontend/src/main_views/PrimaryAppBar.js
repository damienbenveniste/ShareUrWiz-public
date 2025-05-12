import React, { Component, useState } from 'react'
import {
  AppBar,
  Toolbar,
  Menu,
  Stack,
  MenuItem,
  Typography,
  Badge,
  Avatar
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import MoreIcon from '@mui/icons-material/MoreVert'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { Auth } from 'modals/login/firebase_auth'
import LoginContainer from 'modals/login/LoginContainer'
import Constant from 'utils/constants'
import SchoolIcon from '@mui/icons-material/School'
import GradingIcon from '@mui/icons-material/Grading'
import logo from 'logo/favicon.ico'
import logotext from 'logo/logotext2.png'
import { useHistory } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import { UserDAO } from 'api/marketplaceDAO'
import ScheduleIcon from '@mui/icons-material/Schedule';
import { styled } from '@mui/material/styles'

import {
  warningColor
} from 'assets/jss/material-kit-react.js'


function Logo() {

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  return (

    <Stack direction='row'
      justifyContent="center"
      spacing={1}
      alignItems="flex-end">
      <Stack direction='row'
        justifyContent="center"
        alignItems="center"
      >
        <img src={logo} style={{ height: 40 }} alt='logo_image' />
        <img src={logotext} style={mobile ? { height: 20 } : { height: 20 }} alt='logo_text' />

      </Stack>
      <Typography variant='caption'>
        Beta
      </Typography>
    </Stack>
  )
}

function CustomIconButton({ icon, title, ...props }) {
  return (

    <IconButton
      {...props}
      size='small'
      color='inherit'
    >
      <Stack
        justifyContent="center"
        alignItems="center">
        {icon}
        <Typography variant='subtitle2'>
          {title}
        </Typography>
      </Stack>
    </IconButton>
  )
}


function CustomMenuItem({ icon, title, ...props }) {
  return <MenuItem {...props}>
    <Stack direction='row'
      spacing={2}
      justifyContent="center"
      alignItems="center">
      {icon}
      <Typography variant='subtitle1'>
        {title}
      </Typography>
    </Stack>
  </MenuItem>
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))

function LoggedInMenu(props) {

  const history = useHistory()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchor, setAnchor] = useState(null)

  const user = props.user

  const messageIcon = (user && user.unread_messages !== 0) ? (
    <StyledBadge
      badgeContent={user.unread_messages}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      color='primary'>
      <MailIcon />
    </StyledBadge>
  ) : <MailIcon />

  const accountIcon = (user && user.tutor) ? (
    <Avatar
      src={user.tutor.picture}
      srcSet={`${user.tutor.picture}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
      alt={user.tutor.first_name}
      sx={{ width: 30, height: 30 }}>
      <AccountCircle />
    </Avatar>
  ) : <AccountCircle />

  const goToMessaging = () => {
    history.push(Constant.URL.CHAT)
  }

  const goToProfile = () => {
    history.push(Constant.URL.PROFILE_PAGE)
  }

  const goToTutorsFeed = () => {
    history.push(Constant.URL.TUTOR_FEED)
  }

  const goToPostsFeed = () => {
    history.push(Constant.URL.ROOT)
  }

  const goToOther = () => {
    history.push(Constant.URL.OTHER)
  }

  const goToCalendar = () => {
    history.push(Constant.URL.CALENDAR_PAGE)
  }

  const handleMobileMenuClose = () => {
    setAnchor(null);
  }

  const handleMobileMenuOpen = (event) => {
    setAnchor(event.currentTarget);
  }

  if (mobile) {

    return <>
      <Menu
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchor)}
        onClose={handleMobileMenuClose}
      >
        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            goToTutorsFeed()
          }}
          title='Tutors'
          icon={<SchoolIcon />} />

        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            goToPostsFeed()
          }}
          title='Requests'
          icon={<GradingIcon />} />

        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            goToCalendar()
          }}
          title='Calendar'
          icon={<ScheduleIcon />} />

        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            goToMessaging()
          }}
          title='Messages'
          icon={messageIcon} />

        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            goToProfile()
          }}
          title='Profile'
          icon={accountIcon} />

        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            goToOther()
          }}
          title='Other'
          icon={<AlternateEmailIcon />} />

        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            props.logout()
          }}
          title='Logout'
          icon={<LogoutIcon />} />
      </Menu>
      <IconButton
        size='large'
        onClick={handleMobileMenuOpen}
        color='inherit'
      >
        <MoreIcon />
      </IconButton>
    </>
  } else {

    return (
      <>
        <Stack
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
          spacing={2}
        >
          <CustomIconButton
            onClick={goToTutorsFeed}
            title='Tutors'
            icon={<SchoolIcon />} />

          <CustomIconButton
            onClick={goToPostsFeed}
            title='Requests'
            icon={<GradingIcon />} />

          <CustomIconButton
            onClick={goToCalendar}
            title='Calendar'
            icon={<ScheduleIcon />} />

          <CustomIconButton
            onClick={goToMessaging}
            title='Messages'
            icon={messageIcon} />

          <CustomIconButton
            onClick={goToProfile}
            title='Profile'
            icon={accountIcon} />

        </Stack>
        <IconButton
          size='large'
          edge='end'
          onClick={props.logout}
          color='inherit'
        >
          <Typography variant='subtitle1' sx={{ mr: 1 }}>
            Logout
          </Typography>
          <LogoutIcon />
        </IconButton>
      </>
    )
  }
}


function LoggedOutMenu(props) {

  const history = useHistory()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchor, setAnchor] = useState(null)

  const goToTutorsFeed = () => {
    history.push(Constant.URL.TUTOR_FEED)
  }

  const goToPostsFeed = () => {
    history.push(Constant.URL.ROOT)
  }

  const goToOther = () => {
    history.push(Constant.URL.OTHER)
  }

  const handleMobileMenuClose = () => {
    setAnchor(null);
  }

  const handleMobileMenuOpen = (event) => {
    setAnchor(event.currentTarget);
  }

  if (mobile) {

    return <>
      <Menu
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchor)}
        onClose={handleMobileMenuClose}
      >
        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            goToTutorsFeed()
          }}
          title='Tutors'
          icon={<SchoolIcon />} />

        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            goToPostsFeed()
          }}
          title='Requests'
          icon={<GradingIcon />} />

        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            goToOther()
          }}
          title='Other'
          icon={<AlternateEmailIcon />} />

        <CustomMenuItem
          onClick={() => {
            handleMobileMenuClose()
            props.login()
          }}
          title='Login'
          icon={<LoginIcon />} />

      </Menu>
      <IconButton
        size='large'
        onClick={handleMobileMenuOpen}
        color='inherit'
      >
        <MoreIcon />
      </IconButton>
    </>
  } else {

    return (
      <>
        <Stack
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
          spacing={2}
        >
          <CustomIconButton
            onClick={goToTutorsFeed}
            title='Tutors'
            icon={<SchoolIcon />} />

          <CustomIconButton
            onClick={goToPostsFeed}
            title='Requests'
            icon={<GradingIcon />} />

        </Stack>
        <IconButton
          size='large'
          color='inherit'
          onClick={props.login}>
          <Typography variant='subtitle1' sx={{ mr: 1 }}>
            Login
          </Typography>
          <LoginIcon />
        </IconButton>
      </>
    )
  }
}


export default class PrimaryAppBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      firebaseUser: null,
      loginOpen: false,
      user: null,
    }
    this.handleLoginClose = this.handleLoginClose.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    Auth.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        UserDAO.getUser({
          userId: firebaseUser.uid,
          onSuccess: (res) => {
            this.setState({
              user: res,
              firebaseUser: firebaseUser
            })
          },
          onFailure: () => { }
        })
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.firebaseUser !== this.state.firebaseUser && this.state.firebaseUser) {
      UserDAO.getUser({
        userId: this.state.firebaseUser.uid,
        onSuccess: (res) => {
          this.setState({
            user: res,
          })
        },
        onFailure: () => { }
      })
    }
  }

  logout() {
    Auth.logout(
      (mess) => {
        this.setState({ firebaseUser: null })
      },
      (err) => {
      }
    )
  }

  renderMenu() {

    if (this.state.firebaseUser) {
      return <LoggedInMenu logout={this.logout} user={this.state.user} />
    } else {
      return <LoggedOutMenu login={() => { this.setState({ loginOpen: true }) }} />
    }
  }

  handleLoginClose() {
    this.setState({
      loginOpen: false
    })
  }

  render() {
    return (
      <>
        {this.state.loginOpen && !this.state.firebaseUser && <LoginContainer
          open={this.state.loginOpen}
          onClose={this.handleLoginClose}
        />}
        <AppBar
          elevation={0}
          style={{ width: '100vw', background: warningColor }}
        >
          <Toolbar variant='dense'>
            <Stack
              direction='row'
              justifyContent="space-between"
              alignItems="center"
              width='100%'>
              <Logo />
              {this.renderMenu()}
            </Stack>
          </Toolbar>
        </AppBar>
      </>
    )
  }
}
