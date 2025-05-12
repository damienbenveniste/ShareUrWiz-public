import React from 'react'
import { ChatDAO } from 'api/chatDAO'
import {
    TextField,
    Stack,
    Box,
    Paper,
    List,
    ListItem,
    Typography,
    Avatar,
    CircularProgress,
    Button
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { deepOrange, deepPurple } from '@mui/material/colors'
import { getBaseAPI } from 'api/marketplaceDAO'
import { useHistory } from 'react-router-dom'
import Constant from 'utils/constants'
import ErrorBoundary from 'components/ErrorBoundary'


function Message(props) {

    const history = useHistory()

    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    const time_created = new Date(props.message.time_created)
    const author = props.message.author
    var picture = null
    var username = null
    var pictureItem = null
    const color = (props.userId === author.id) ? { bgcolor: deepOrange[500] } : { bgcolor: deepPurple[500] }
    if (author.tutor) {
        picture = author.tutor.picture
        username = author.tutor.first_name.concat(' ', author.tutor.last_name)
        pictureItem = <IconButton
            onClick={() => {
                history.push(Constant.URL.TUTOR_PROFILE + `/${author.tutor.user}`)
            }}>
            <Avatar
                src={picture}
                alt={username}
                sx={color}>
                {username.charAt(0).toUpperCase()}
            </Avatar>
        </IconButton>
    } else {
        username = author.username
        pictureItem = <Avatar
            alt={username}
            sx={color}>
            {username.charAt(0).toUpperCase()}
        </Avatar>
    }

    return <ListItem sx={{ width: '100%' }}>
        <Stack spacing={1} sx={{ width: '100%' }}>
            <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center' >
                <Stack
                    direction='row'
                    justifyContent='flex-start'
                    alignItems='center' >
                    {pictureItem}
                    <Typography >
                        <b>{username}</b>
                    </Typography>
                </Stack>
                <Typography variant='body2'>
                    {time_created.toLocaleString('en-US', options)}
                </Typography>
            </Stack>
            <Typography variant='body2'>
                {props.message.content}
            </Typography>
        </Stack>
    </ListItem>
}

function MessageList(props) {

    const messages = props.messages.map((message, index) => {
        return <Message
            key={index}
            message={message}
            userId={props.userId}
        />

    }).reverse()

    return <List sx={{ width: '100%' }}>
        {messages}
    </List>
}


export default class Messaging extends React.Component {

    constructor(props) {
        super(props)

        this.topPage = this.topPage.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.connect = this.connect.bind(this)

        this.state = {
            newMessages: [],
            oldMessages: [],
            username: null,
            totalPages: 1,
            loading: false,
            page: 1,
            messageValue: '',
            socketLoading: false,
            messageLoading: false
        }

        this.ws = null
        this.active_connection = false
        this.observer = React.createRef()
        this.connection_id = (
            this.props.connection.id !== undefined
        ) ? this.props.connection.id : this.props.connection.user
    }

    getURL(room) {
        const host = getBaseAPI({ remove_http: true })
        const protocol = (host === 'localhost:8000') ? 'ws' : 'wss'
        return `${protocol}://${host}/ws/chat/${room}/`
    }

    componentDidMount() {

        if (this.props.userId !== this.connection_id) {
            this.setState({ loading: true })
            ChatDAO.getMessages({
                user_id: this.props.userId,
                connection_id: this.connection_id,
                page: this.state.page,
                onSuccess: (res) => {
                    this.setState(prevState => ({
                        newMessages: res.data.results,
                        oldMessages: prevState.oldMessages.concat(prevState.newMessages),
                        totalPages: res.data.total_pages,
                        loading: false,
                        page: prevState.page + 1
                    }))
                    if (this.messagesAnchor) {
                        this.messagesAnchor.scrollIntoView({ block: 'nearest' })
                    }

                    const room = `${this.props.userId}_${this.connection_id}`
                    const url = this.getURL(room)
                    this.connect(url)
                }
            })
        }
    }

    topPage(node) {
        if (this.state.loading || this.page >= this.state.totalPages) return
        if (this.observer.current) this.observer.current.disconnect()
        this.observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {

                this.setState({ loading: true })
                ChatDAO.getMessages({
                    user_id: this.props.userId,
                    connection_id: this.connection_id,
                    page: this.state.page,
                    onSuccess: (res) => {
                        this.setState(prevState => ({
                            newMessages: res.data.results,
                            oldMessages: prevState.oldMessages.concat(prevState.newMessages),
                            loading: false,
                            page: prevState.page + 1
                        }))
                        if (this.messagesAnchor) {
                            this.messagesAnchor.scrollIntoView({ block: 'center' })
                        }
                    }
                })
            }
        })
        if (node) this.observer.current.observe(node)
    }

    connect(url) {
        this.setState({ socketLoading: true })
        var ws = new WebSocket(url)
        ws.onopen = () => {
            this.active_connection = true
            this.setState({ socketLoading: false })
        }

        ws.onmessage = e => {
            this.onMessageReceived(e.data)
        }

        ws.onclose = e => {
            if (this.active_connection) this.connect(url)
        }

        ws.onerror = (err) => {
            console.error('Socket encountered error: ', err, 'Closing socket')
            this.active_connection = false
            ws.close()
        }

        this.ws = ws
    }

    onMessageReceived(msg) {
        this.setState(prevState => ({
            newMessages: (prevState.oldMessages.length === 0) ? (
                [JSON.parse(msg)].concat(prevState.newMessages)
            ) : (
                [JSON.parse(msg)].concat(prevState.oldMessages.slice(0, 30))
            ),
            oldMessages: [],
            page: 1,
            messageValue: '',
            messageLoading: false
        }))
        if (this.messagesAnchor) this.messagesAnchor.scrollIntoView()
    }

    sendMessage(text) {
        if (text === '') return

        const message = {
            user: this.props.userId,
            message: text
        }
        if (this.ws) {
            this.ws.send(JSON.stringify(message))
            this.setState({ messageLoading: true })
        }
    }

    render() {

        return <ErrorBoundary>
            <Stack sx={{
                width: '100%',
                height: '100%',
                minHeight: { xs: this.props.minHeight, md: 0 },
            }} spacing={1}>

                <Paper sx={{
                    width: '100%',
                    overflow: 'hidden',
                    flexGrow: 1,
                    position: 'relative',
                    backgroundColor: '#FFF9EF'
                }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflow: 'auto',
                        }}
                    >
                        {this.state.page < this.state.totalPages && <div ref={this.topPage} />}
                        {this.state.page < this.state.totalPages && <div style={{ height: 100 }} />}
                        {((this.state.loading && this.state.page < this.state.totalPages) || this.state.socketLoading) && <CircularProgress />}
                        <MessageList
                            sx={{ width: '100%' }}
                            messages={this.state.newMessages}
                            userId={this.props.userId}
                        />
                        <div ref={(el) => { this.messagesAnchor = el }} />
                        <MessageList
                            sx={{ width: '100%' }}
                            messages={this.state.oldMessages}
                            userId={this.props.userId}
                        />
                    </Box>
                </Paper>

                <TextField
                    sx={{ flexGrow: 0 }}
                    fullWidth
                    multiline
                    value={this.state.messageValue}
                    onChange={(e) => { this.setState({ messageValue: e.target.value }) }}
                    id='outlined-basic'
                    label='Write a message...'
                    variant='outlined' />
                <Button
                    variant='contained'
                    disabled={(this.state.messageValue === '') ? true : false}
                    onClick={() => { this.sendMessage(this.state.messageValue) }}
                >
                    {this.state.messageLoading ? <CircularProgress color='inherit' /> : 'Send'}
                </Button>
            </Stack>
        </ErrorBoundary>
    }
}
