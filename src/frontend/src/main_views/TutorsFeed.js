import React, { Component, useState } from 'react'
import {
  List,
  ListItem,
  Pagination,
  Stack,
  Grid,
  Paper,
  Box,
  Button,
  Slider,
  Typography,
  TextField,
  Drawer,
  Skeleton
} from '@mui/material'

import {
  LocalizationProvider,
  StaticDatePicker
} from '@mui/lab'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import CategoryList from 'components/CategoryList'
import TimePicker from '@mui/lab/TimePicker'

import EditIcon from '@mui/icons-material/Edit'
import ProfileCard from 'components/ProfileCard'
import { TutorProfileDAO } from 'api/marketplaceDAO'
import Constant from 'utils/constants'
import LoginContainer from 'modals/login/LoginContainer'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Auth } from 'modals/login/firebase_auth'
import CreateProfileContainer from 'modals/create_profile/CreateProfileContainer'
import OtherLinks from 'main_views/OtherLinks'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useHistory } from 'react-router-dom'
import { TutorInformation } from 'components/HelperComponents'
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4'


function CustomSlider(props) {
  return (

    <Box sx={{ width: '100%', display: 'block', pl: 2, pr: 2 }} >
      <Typography id='input-slider' style={{ float: 'center' }}>
        Price Range: ${props.minPrice} - ${props.maxPrice}
      </Typography>
      <Slider
        value={[props.minPrice, props.maxPrice]}
        sx={{ float: 'center' }}
        step={10}
        max={10000}
        min={0}
        onChange={(event, value) => {
          props.setMinPrice(value[0])
          props.setMaxPrice(value[1])
        }}
        valueLabelDisplay='auto'
      />
    </Box>
  )
}


function Calendar(props) {

  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [calendarValue, setCalendarValue] = useState(null)
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={1}>
          <StaticDatePicker
            displayStaticWrapperAs={mobile ? 'mobile' : 'desktop'}
            openTo='day'
            value={calendarValue}
            allowSameDateSelection={true}
            onChange={(newValue) => {
              newValue.setHours(0, 0, 0, 0)
              if (calendarValue && new Date(newValue).valueOf() === new Date(calendarValue).valueOf()) {
                setCalendarValue(null)
                setButtonDisabled(true)
                props.setTimeStart(null)
                props.setTimeEnd(null)
              } else {

                const timeStart = new Date(newValue.valueOf())
                const hour = timeStart.getHours()
                const minute = timeStart.getMinutes()
                timeStart.setHours(hour, minute, 0, 0)
                const timeEnd = new Date(newValue.valueOf())
                timeEnd.setHours(hour, minute, 0, 0)
                setCalendarValue(newValue)
                setButtonDisabled(false)
                props.setTimeStart(timeStart)
                props.setTimeEnd(timeEnd)
              }
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <Typography style={{ float: 'center' }}>
            Between
          </Typography>
          <TimePicker
            disabled={buttonDisabled}
            value={props.timeStart}
            onChange={(value) => {
              const date = new Date(calendarValue.valueOf())
              const hour = value.getHours()
              const minute = value.getMinutes()
              date.setHours(hour, minute, 0, 0)
              props.setTimeStart(date)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <Typography style={{ float: 'center' }}>
            And
          </Typography>
          <TimePicker
            disabled={buttonDisabled}
            value={props.timeEnd}
            onChange={(value) => {
              const date = new Date(calendarValue.valueOf())
              const hour = value.getHours()
              const minute = value.getMinutes()
              date.setHours(hour, minute, 0, 0)
              props.setTimeEnd(date)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </LocalizationProvider>
    </Box >
  )
}


function FilterOptions(props) {

  const [minPrice, setMinPrice] = useState(1)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [categories, setCategories] = useState([])
  const [timeStart, setTimeStart] = useState(null)
  const [timeEnd, setTimeEnd] = useState(null)

  return (
    <Stack spacing={2} sx={{ ml: 2, mr: 2, pt: 3, mb: 2 }}>
      <CategoryList
        freeSolo={false}
        categories={categories}
        onCategoriesChange={setCategories} />
      <CustomSlider
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice} />
      <Calendar
        timeStart={timeStart}
        timeEnd={timeEnd}
        setTimeStart={setTimeStart}
        setTimeEnd={setTimeEnd} />
      <Button
        variant='contained'
        onClick={() => props.filter(
          categories,
          minPrice,
          maxPrice,
          timeStart,
          timeEnd,
        )}
      >
        Filter
      </Button>
    </Stack>
  )
}


function Feed(props) {

  const history = useHistory()

  const skeleton = [...Array(3).keys()].map(i => {
    return (
      <ListItem key={i} disableGutters sx={{ width: '100%' }}>
        <Stack spacing={1} sx={{ width: '100%' }}>
          <Skeleton variant='text' width='100%' />
          <Skeleton variant='circular' width={100} height={100} />
          <Skeleton variant='rectangular' width='100%' height={118} />
        </Stack>
      </ListItem>
    )
  })

  const profiles = props.profiles.map((profile, id) => {
    return (
      <ListItem key={id} disableGutters>
        <ProfileCard
          key={id}
          picture={profile.picture}
          firstName={profile.first_name}
          lastName={profile.last_name}
          summary={profile.summary}
          specialties={profile.specialties}
          price={profile.price}
          rating={profile.rating}
          numRating={profile.num_rating}
          onClick={() => {
            history.push(
              Constant.URL.TUTOR_PROFILE + `/${profile.user}`,
              { profile: profile }
            )
          }}
        />
      </ListItem>
    )
  })

  return (
    <Stack spacing={1} style={{ height: '100%', width: '100%' }} >
      <Stack direction='row'>
        <Button
          variant='contained'
          sx={{ width: '100%' }}
          disableElevation={true}
          startIcon={<AddCircleIcon />}
          onClick={props.createProfileButtonClick}
        >
          Create Your Tutor Profile
        </Button>
        <TutorInformation />
      </Stack>
      <div style={{ height: '100%', overflow: 'auto' }}>
        {props.ok ? <List >
          {props.loading ? skeleton : profiles}
        </List> : <Stack
          justifyContent="center"
          alignItems="center">
          <SignalWifiStatusbarConnectedNoInternet4Icon
            color='disabled'
            sx={{ height: 50, width: 50 }} />
          <Typography variant='h6' color='gray'>
            Oops something went wrong!
          </Typography>
        </Stack>}
      </div>
      <Pagination style={{ marginLeft: 'auto', marginRight: 'auto' }}
        count={props.pageCount}
        onChange={props.onPageChange}
        page={props.page}
        siblingCount={0}
        boundaryCount={1}
      />
    </Stack>
  )
}


class TutorsFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profiles: [],
      page: 1,
      pageCount: 0,
      drawerOpen: false,
      categories: [],
      minPrice: 0,
      maxPrice: 10000,
      loginOpen: false,
      timeStart: null,
      timeEnd: null,
      createProfileOpen: false,
      profileLoading: false,
      ok: true
    }

    this.onPageChange = this.onPageChange.bind(this)
    this.handleLoginClose = this.handleLoginClose.bind(this)
    this.handleCreateProfileClose = this.handleCreateProfileClose.bind(this)
    this.createProfileButtonClick = this.createProfileButtonClick.bind(this)
    this.filter = this.filter.bind(this)
    this.user = null
  }

  componentDidMount() {
    this.setState({ profileLoading: true })
    TutorProfileDAO.getProfiles({
      page: 1,
      categories: [],
      minPrice: null,
      maxPrice: null,
      timeStart: null,
      timeEnd: null,
      onSuccess: (res) => {
        this.setState({
          profiles: res.data.results,
          pageCount: res.data.total_pages,
          profileLoading: false,
          ok: true
        })
      },
      onFailure: (mess) => {
        this.setState({
          ok: false,
          profileLoading: false
        })
      }
    })
  }

  onPageChange(event, page) {

    this.setState({
      profileLoading: true,
      page: page,
    })

    TutorProfileDAO.getProfiles({
      page: page,
      categories: this.state.categories,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      timeStart: this.state.timeStart,
      timeEnd: this.state.timeEnd,
      onSuccess: (res) => {
        this.setState({
          profiles: res.data.results,
          pageCount: res.data.total_pages,
          profileLoading: false,
          ok: true
        })
      },
      onFailure: (mess) => {
        this.setState({
          ok: false,
          profileLoading: false
        })
      }
    })
  }

  filter(categories, minPrice, maxPrice, timeStart, timeEnd) {
    this.setState({ profileLoading: true })
    TutorProfileDAO.getProfiles({
      page: 1,
      categories: categories,
      minPrice: minPrice,
      maxPrice: maxPrice,
      timeStart: timeStart,
      timeEnd: timeEnd,
      onSuccess: (res) => {
        this.setState({
          profiles: res.data.results,
          pageCount: res.data.total_pages,
          profileLoading: false,
          categories: categories,
          minPrice: minPrice,
          maxPrice: maxPrice,
          timeStart: timeStart,
          timeEnd: timeEnd,
          ok: true
        })
      },
      onFailure: (mess) => {
        this.setState({
          ok: false,
          profileLoading: false
        })
      }
    })
  }

  renderFeed() {
    return <Grid container spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
      <Grid item xs={3}>
        <Paper sx={{ height: '90vh' }}>
          <FilterOptions filter={this.filter} />
        </Paper>
      </Grid>
      <Grid item xs={6} sx={{ height: '90vh' }}>
        <Feed
          profiles={this.state.profiles}
          createProfileButtonClick={this.createProfileButtonClick}
          loading={this.state.profileLoading}
          pageCount={this.state.pageCount}
          onPageChange={this.onPageChange}
          page={this.state.page}
          ok={this.state.ok}
        />
      </Grid>
      <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <OtherLinks />
      </Grid>
    </Grid>
  }

  renderMobileFeed() {

    const toggleDrawer = (open) => {
      this.setState({ drawerOpen: open })
    }

    return (
      <Stack
        sx={{ display: { xs: '', md: 'none' }, height: '90vh', pb: 3, top: 0, bottom: 0 }}
        spacing={1}>
        <Button
          color='primary'
          onClick={(e) => toggleDrawer(true)}
          startIcon={<EditIcon />}>
          Filter
        </Button>
        <Drawer
          anchor='bottom'
          open={this.state.drawerOpen}
          onClose={(e) => toggleDrawer(false)}
        >
          <Button onClick={() => toggleDrawer(false)}> Close </Button>
          <FilterOptions filter={this.filter} />
        </Drawer>
        <Feed
          profiles={this.state.profiles}
          createProfileButtonClick={this.createProfileButtonClick}
          loading={this.state.profileLoading}
          pageCount={this.state.pageCount}
          onPageChange={this.onPageChange}
          page={this.state.page}
          ok={this.state.ok}
        />
      </Stack>
    )

  }

  handleLoginClose() {
    this.setState({
      loginOpen: false
    })
  }

  createProfileButtonClick() {
    Auth.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        this.setState({ createProfileOpen: true })
      } else {
        this.setState({ loginOpen: true })
      }
    })
  }

  handleCreateProfileClose() {
    this.setState({ createProfileOpen: false })
  }

  render() {
    return (
      <>
        {this.state.loginOpen && <LoginContainer
          open={this.state.loginOpen}
          onClose={this.handleLoginClose}
        />}
        {this.state.createProfileOpen && this.user && <CreateProfileContainer
          open={this.state.createProfileOpen}
          onClose={this.handleCreateProfileClose}
          userId={this.user.uid}
        />}
        {this.renderMobileFeed()}
        {this.renderFeed()}
      </>
    )
  }
}

export default TutorsFeed

