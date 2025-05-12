import React, { Component, useState } from 'react'
import PostCard from 'components/PostCard'
import {
  Stack,
  Paper,
  Grid,
  Pagination,
  Box,
  Slider,
  Typography,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  List,
  ListItem,
  Drawer,
  Skeleton
} from '@mui/material'
import { PostDAO } from 'api/marketplaceDAO'
import CategoryList from 'components/CategoryList'
import EditIcon from '@mui/icons-material/Edit'
import { Auth } from 'modals/login/firebase_auth'
import Messaging from 'main_views/chat/Messaging'
import IconButton from '@mui/material/IconButton'
import LoginContainer from 'modals/login/LoginContainer'
import CreateRequest from 'modals/CreateRequest'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import OtherLinks from 'main_views/OtherLinks'
import { TutoringInformation } from 'components/HelperComponents'
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

function Levels(props) {

  const levels = [
    'Beginner',
    'Intermediate',
    'Advanced',
  ]

  const levelComponents = levels.map((level, index) =>
    <FormControlLabel
      key={index}
      onChange={(event) => {
        const selectedLevels = new Set(props.selectedLevels)
        if (event.target.checked) {
          selectedLevels.add(event.target.name)
        } else if (selectedLevels.has(event.target.name)) {
          selectedLevels.delete(event.target.name)
        }
        props.setSelectedLevels(selectedLevels)
      }}
      control={
        <Checkbox name={level} />
      }
      label={level}
    />
  )
  return (
    <Box sx={{ display: 'flex' }} >
      <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
        <FormLabel sx={{ textAlign: 'left' }}>Levels</FormLabel>
        <FormGroup>
          {levelComponents}
        </FormGroup>
      </FormControl>
    </Box>
  )
}

function FilterOptions(props) {

  const [minPrice, setMinPrice] = useState(1)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [categories, setCategories] = useState([])
  const [selectedLevels, setSelectedLevels] = useState(new Set())

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
      <Levels
        selectedLevels={selectedLevels}
        setSelectedLevels={setSelectedLevels}
      />
      <Button
        variant='contained'
        onClick={() => props.filter(
          categories,
          selectedLevels,
          minPrice,
          maxPrice
        )}
      >
        Filter
      </Button>
    </Stack>
  )
}


function Feed(props) {

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

  const options = { year: '2-digit', month: 'short', day: 'numeric' }
  const posts = props.posts.map((post) => {
    let date = new Date(post.time_created)
    return (
      <ListItem key={post.id} disableGutters>
        <PostCard
          key={post.id}
          title={post.title}
          description={post.description}
          min_price={post.min_price}
          max_price={post.max_price}
          date={date.toLocaleDateString('en-US', options)}
          username={post.author.username}
          categories={post.categories}
          level={post.level}
          onClick={() => { props.onPostButtonClick(post.author) }}
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
          onClick={props.createRequestButtonClick}
        >
          Create a Tutoring Request
        </Button>
        <TutoringInformation />
      </Stack>
      <div style={{ height: '100%', overflow: 'auto' }}>
        {props.ok ? <List>
          {props.loading ? skeleton : posts}
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


function MessageBox({ user, selectedTutee, closeMessaging, ...props }) {
  return (
    <Stack
      {...props}
      spacing={2}>
      <IconButton onClick={closeMessaging}>
        <CloseIcon />
      </IconButton>
      <Typography align='center' variant='h5'>
        {selectedTutee.username}
      </Typography>
      <Messaging
        minHeight='70vh'
        key={selectedTutee.id}
        connection={selectedTutee}
        userId={user.uid}
        style={{ height: '100%' }} />
    </Stack >
  )
}


export default class PostsFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      page: 1,
      pageCount: 0,
      drawerOpen: false,
      loginOpen: false,
      createRequestOpen: false,
      messagingOpen: false,
      postLoading: false,
      categories: [],
      selectedLevels: new Set(),
      minPrice: 1,
      maxPrice: 10000,
      ok: true
    }

    this.onPageChange = this.onPageChange.bind(this)
    this.onPostButtonClick = this.onPostButtonClick.bind(this)
    this.handleLoginClose = this.handleLoginClose.bind(this)
    this.handleCreateRequestClose = this.handleCreateRequestClose.bind(this)
    this.createRequestButtonClick = this.createRequestButtonClick.bind(this)
    this.filter = this.filter.bind(this)
    this.user = null
    this.selectedTutee = null
  }

  componentDidMount() {
    this.setState({ postLoading: true })
    PostDAO.getPosts({
      page: this.state.page,
      categories: this.state.categories,
      selectedLevels: this.state.selectedLevels,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      onSuccess: (res) => {
        this.setState({
          posts: res.data.results,
          pageCount: res.data.total_pages,
          postLoading: false,
          ok: true
        })
      },
      onFailure: (mess) => {
        this.setState({
          ok: false,
          postLoading: false,
        })
      }
    })
  }

  filter(categories, selectedLevels, minPrice, maxPrice) {
    this.setState({ postLoading: true })
    PostDAO.getPosts({
      page: 1,
      categories: categories,
      selectedLevels: selectedLevels,
      minPrice: minPrice,
      maxPrice: maxPrice,
      onSuccess: (res) => {
        this.setState({
          page: 1,
          posts: res.data.results,
          pageCount: res.data.total_pages,
          postLoading: false,
          categories: categories,
          selectedLevels: selectedLevels,
          minPrice: minPrice,
          maxPrice: maxPrice,
          ok: true
        })
      },
      onFailure: (mess) => {
        this.setState({
          ok: false,
          postLoading: false,
        })
      }
    })
  }

  onPostButtonClick(selectedTutee) {

    Auth.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        this.selectedTutee = selectedTutee
        this.messagingId = Math.random()
        this.setState({ messagingOpen: true })

      } else {
        this.setState({ loginOpen: true })
      }
    })
  }

  onPageChange(event, page) {

    this.setState({
      postLoading: true,
      page: page,
    })
    PostDAO.getPosts({
      page: page,
      categories: this.state.categories,
      selectedLevels: this.state.selectedLevels,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      onSuccess: (res) => {
        this.setState({
          posts: res.data.results,
          pageCount: res.data.total_pages,
          postLoading: false,
          ok: true
        })
      },
      onFailure: (mess) => {
        this.setState({
          ok: false,
          postLoading: false,
        })
      }
    })
  }

  renderFeed() {
    return (
      <Grid container spacing={2} sx={{ display: { xs: 'none', md: 'flex' }, width: '100%' }}>
        <Grid item xs={3}>
          <Paper sx={{ height: '90vh' }}>
            {this.state.messagingOpen ? <MessageBox
              sx={{ height: '100%' }}
              closeMessaging={() => {
                this.setState({ messagingOpen: false })
                this.selectedTutee = null
              }}
              selectedTutee={this.selectedTutee}
              user={this.user}
            /> : <FilterOptions filter={this.filter} />}
          </Paper>
        </Grid>
        <Grid item xs={6} sx={{ height: '90vh' }}>
          <Feed
            posts={this.state.posts}
            onPostButtonClick={this.onPostButtonClick}
            createRequestButtonClick={this.createRequestButtonClick}
            loading={this.state.postLoading}
            pageCount={this.state.pageCount}
            onPageChange={this.onPageChange}
            page={this.state.page}
            ok={this.state.ok}
          />
        </Grid>
        <Grid item xs={3} sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <OtherLinks />
        </Grid>
      </Grid>
    )
  }

  renderMobileFeed() {

    const toggleDrawer = (open) => {
      this.setState({ drawerOpen: open })
    }
    return (
      this.state.messagingOpen ? <MessageBox
        sx={{ display: { xs: '', md: 'none' }, height: '100%' }}
        closeMessaging={() => {
          this.setState({ messagingOpen: false })
          this.selectedTutee = null
        }}
        selectedTutee={this.selectedTutee}
        user={this.user}
      /> : <Stack
        sx={{ display: { xs: '', md: 'none' }, height: '90vh', pb: 3, top: 0, bottom: 0 }}
        spacing={1}>
        <Button
          color='primary'
          onClick={() => toggleDrawer(true)}
          startIcon={<EditIcon />}>
          Filter
        </Button>
        <Drawer
          anchor='bottom'
          open={this.state.drawerOpen}
          onClose={() => toggleDrawer(false)}
        >
          <Button onClick={() => toggleDrawer(false)}> Close </Button>
          <FilterOptions filter={this.filter} />
        </Drawer>
        <Feed
          posts={this.state.posts}
          onPostButtonClick={this.onPostButtonClick}
          createRequestButtonClick={this.createRequestButtonClick}
          loading={this.state.postLoading}
          pageCount={this.state.pageCount}
          onPageChange={this.onPageChange}
          page={this.state.page}
          ok={this.state.ok} />
      </ Stack>
    )
  }

  handleLoginClose() {
    this.setState({
      loginOpen: false
    })
  }

  onRequestClick() {

    Auth.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        this.setState({ messagingOpen: true })

      } else {
        this.setState({ loginOpen: true })
      }
    })
  }

  handleCreateRequestClose(post) {

    if (post === null) {
      this.setState({
        createRequestOpen: false,
      })
    } else {
      const posts = [...this.state.posts]
      posts.unshift(post)
      this.setState({
        createRequestOpen: false,
        posts: posts
      })

    }
  }

  createRequestButtonClick() {
    Auth.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        this.setState({ createRequestOpen: true })

      } else {
        this.setState({ loginOpen: true })
      }
    })
  }

  render() {
    return (
      <>
        {this.state.loginOpen && <LoginContainer
          open={this.state.loginOpen}
          onClose={this.handleLoginClose}
        />}
        {this.state.createRequestOpen && this.user && <CreateRequest
          open={this.state.createRequestOpen}
          onClose={this.handleCreateRequestClose}
          user={this.user}
        />}
        {this.renderMobileFeed()}
        {this.renderFeed()}
      </>
    )
  }
}