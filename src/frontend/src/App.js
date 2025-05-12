import { BrowserRouter, Route, Switch } from 'react-router-dom'
import TutorProfile from 'main_views/TutorProfile'
import ProfilePage from 'main_views/profile/ProfilePage'
import Chat from 'main_views/chat/Chat'
import CalendarPage from 'main_views/calendar/CalendarPage'
import Constant from './utils/constants'
import PrivateRoute from 'modals/login/PrivateRoute'
import {
  Container,
  Stack,
  CssBaseline,
  useMediaQuery
} from '@mui/material'
import PrimaryAppBar from 'main_views/PrimaryAppBar'
import MeetingNote from 'main_views/MeetingNote'
import PostsFeed from 'main_views/PostsFeed'
import TutorsFeed from 'main_views/TutorsFeed'
import PrivacyPage from 'main_views/PrivacyPage'
import TermPage from 'main_views/TermPage'
import AboutPage from 'main_views/AboutPage'
import RefreshPage from 'main_views/RefreshPage'
import MeetingPage from 'main_views/MeetingPage'
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles'
import OtherLinks from 'main_views/OtherLinks'
import ErrorBoundary from 'components/ErrorBoundary'


const corlorTheme = createTheme({
  palette: {
    primary: {
      main: '#0096fe'
    }
  }
})

function RouteAppBar({ ...props }) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  return <Stack spacing={mobile ? 6 : 9} sx={{ height: '100vh', width: '100%', background: '#f8f8f8', overflow:'auto' }}
    justifyContent='center'
    alignItems='center'>
    <ErrorBoundary>
      <PrimaryAppBar />
    </ErrorBoundary>
    <Container maxWidth='xl' sx={{ height: '100%', width: '100%' }}>
      <ErrorBoundary>
        <Route {...props} />
      </ErrorBoundary>
    </Container>
  </Stack>
}

function PrivaRouteAppBar({ ...props }) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  return <Stack spacing={mobile ? 6 : 9} sx={{ height: '100vh', width: '100%', background: '#f8f8f8', overflow:'auto'  }}
    justifyContent='center'
    alignItems='center'>
    <ErrorBoundary>
      <PrimaryAppBar />
    </ErrorBoundary>
    <Container maxWidth='xl' sx={{ height: '100%', width: '100%' }}>
      <ErrorBoundary>
        <PrivateRoute {...props} />
      </ErrorBoundary>
    </Container>
  </Stack>
}



function App() {

  return (
    <ThemeProvider theme={corlorTheme}>
      <BrowserRouter>
        <CssBaseline />
        <Switch>
          <RouteAppBar exact path={Constant.URL.ROOT} component={PostsFeed} />
          <RouteAppBar exact path={Constant.URL.ABOUT_PAGE} component={AboutPage} />
          <RouteAppBar exact path={Constant.URL.PRIVACY_PAGE} component={PrivacyPage} />
          <RouteAppBar exact path={Constant.URL.TERM_PAGE} component={TermPage} />
          <RouteAppBar exact path={Constant.URL.TUTOR_FEED} component={TutorsFeed} />
          <RouteAppBar exact path={Constant.URL.OTHER} component={OtherLinks} />
          <RouteAppBar path={Constant.URL.TUTOR_PROFILE + '/:profileId'} component={TutorProfile} />
          <PrivaRouteAppBar exact path={Constant.URL.PROFILE_PAGE} component={ProfilePage} />
          <PrivaRouteAppBar exact path={Constant.URL.CALENDAR_PAGE} component={CalendarPage} />
          <PrivaRouteAppBar exact path={Constant.URL.CHAT} component={Chat} />
          <PrivaRouteAppBar path={Constant.URL.REFRESH_PAGE + '/:userId'} component={RefreshPage} />
          <PrivaRouteAppBar path={Constant.URL.MEETING_NOTE + '/:noteId'} component={MeetingNote} />
          <PrivateRoute exact path={Constant.URL.MEETING} component={MeetingPage} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App
