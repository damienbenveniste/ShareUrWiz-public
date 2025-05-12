
import React, { Component, useEffect, useState } from 'react'

import { useHistory, withRouter } from 'react-router'
import CodeEditor from 'main_views/collaboration_tools/CodeEditor'
import TextEditor from 'main_views/collaboration_tools/TextEditor'
import SocketConnection from 'api/webSocketConnection'
import DiagramEditor from 'main_views/collaboration_tools/DiagramEditor'
import AddIcon from '@mui/icons-material/Add'
import { Auth } from 'modals/login/firebase_auth'
import { UserDAO } from 'api/marketplaceDAO'
import { NoteDAO } from 'api/noteDAO'
import Constant from 'utils/constants'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import CheckIcon from '@mui/icons-material/Check'

import {
    Button,
    Stack,
    ButtonGroup,
    Typography,
    IconButton,
    TextField
} from '@mui/material'

class Type {
    static CODE = 'code'
    static TEXT = 'text'
    static DIAGRAM = 'diagram'
}

class Action {
    static ADD = 'add'
    static UPDATE = 'update'
    static DELETE = 'delete'
}


function Title(props) {

    const [edit, setEdit] = useState(false)
    const [title, setTitle] = useState(props.title)

    const editView = <Stack direction='row' sx={{ width: '100%' }}>
        <TextField
            label='Title'
            variant='outlined'
            defaultValue={title}
            onChange={e => {
                NoteDAO.updateNote({
                    noteId: props.noteId,
                    title: title,
                    onSuccess: () => setTitle(e.target.value),
                    onFailure: () => { }
                })
            }} />
        <IconButton onClick={() => setEdit(false)}>
            <CheckIcon />
        </IconButton>
    </Stack>

    const nonEditView = <Stack direction='row' sx={{ width: '100%' }}>
        <Typography variant='h4' align='left'>
            {title}
        </Typography>
        <IconButton onClick={() => setEdit(true)}>
            <ModeEditIcon />
        </IconButton>
    </Stack>

    return edit ? editView : nonEditView

}


class MeetingNote extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            internalState: {},
            title: '',
            user: null,
            requesterId: null,
            lastUpdateTime: new Date(),
            participants: []
        }

        this.onChange = this.onChange.bind(this)
        this.onStateReceived = this.onStateReceived.bind(this)
        this.addCodeEditor = this.addCodeEditor.bind(this)
        this.addTextEditor = this.addTextEditor.bind(this)
        this.addDiagramEditor = this.addDiagramEditor.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.update = this.update.bind(this)
        this.add = this.add.bind(this)
        this.delete = this.delete.bind(this)
        this.compareLastSentState = this.compareLastSentState.bind(this)
        this.connection = new SocketConnection({ onMessageReceived: this.onStateReceived })

        this.noteId = this.props.match.params.noteId
        this.lastInterstate = {}
    }

    componentDidUpdate() {

        const { user, participants } = this.state
        if (!user || participants.length === 0) return

        if (!participants.includes(user.id)) {
            this.props.history.replace(Constant.URL.ROOT)
        }
    }

    compareLastSentState() {

        const { internalState } = this.state
        Object.entries(internalState).map(([idx, comp]) => {
            if (!idx in this.lastInterstate) {
                this.lastInterstate[idx] = comp.value
            } else if (this.lastInterstate[idx] !== comp.value) {
                NoteDAO.updateNoteCell({
                    noteCellId: idx,
                    content: comp.value,
                    onSuccess: () => {
                        this.lastInterstate[idx] = comp.value
                    },
                    onFailure: () => { }
                })

            }
        })
    }

    componentDidMount() {
        Auth.auth().onAuthStateChanged((user) => {
            if (user) {
                UserDAO.getUser({
                    userId: user.uid,
                    onSuccess: (res) => this.setState({
                        user: res,
                        requesterId: res.id,
                    }),
                    onFailure: (mess) => {
                        this.props.history.replace(Constant.URL.ROOT)
                    }
                })
            }
        })
        NoteDAO.getNote({
            noteId: this.noteId,
            onSuccess: (res) => {
                const internalState = Object.fromEntries(res.note_cells.map(cell => {
                    return [cell.id, {
                        type: cell.type,
                        value: cell.content,
                    }]
                }))

                this.setState({
                    title: res.title,
                    participants: res.participants_id,
                    internalState: internalState
                })

                console.log(internalState)

                this.connection.connect('meeting-note', res.id)

            },
            onFailure: () => {
                this.props.history.replace(Constant.URL.ROOT)
            }
        })

        setInterval(this.compareLastSentState, 2000)
    }

    shouldComponentUpdate(nextProps, nextState) {
        const newTime = nextState.lastUpdateTime.getTime()
        const oldTime = this.state.lastUpdateTime.getTime()

        return newTime === oldTime || newTime - oldTime > 10
    }

    update(internalState, idx, value, userId) {
        internalState[idx].value = value
        this.setState({
            internalState: internalState,
            requesterId: userId,
            lastUpdateTime: new Date()
        })
    }

    add(internalState, type, id, callback) {
        const initState = {
            value: '',
            type: type
        }

        if (id) {
            internalState[id] = initState
            this.setState({ internalState: internalState })
        } else {
            NoteDAO.createNoteCell({
                type: type,
                noteId: this.noteId,
                onSuccess: (res) => {
                    internalState[res.id] = initState
                    this.setState({ internalState: internalState })
                    callback(res.id)
                },
                onFailure: () => { }
            })
        }
    }

    delete(internalState, idx, received, callback) {

        if (received) {
            delete internalState[idx]
            this.setState({ internalState: internalState })
        } else {
            NoteDAO.deleteNoteCell({
                noteCellId: idx,
                onSuccess: () => {
                    delete internalState[idx]
                    this.setState({ internalState: internalState })
                    callback(idx)
                },
                onFailure: () => { }
            })
        }
    }

    onChange(idx) {
        return (value) => {
            const { internalState, user } = this.state
            const bundle = [idx, value, Action.UPDATE, user.id]

            if (internalState[idx].type === Type.TEXT) {
                const oldTime = this.state.lastUpdateTime.getTime()
                const now = (new Date()).getTime()
                if (now - oldTime > 100) {
                    this.connection.sendMessage(bundle)
                }
            } else {
                this.connection.sendMessage(bundle)
            }
            this.update(internalState, idx, value, user.id)
        }
    }

    onDelete(idx) {
        return () => {
            const { internalState, user } = this.state
            this.delete(
                internalState,
                idx,
                false,
                (id) => {
                    const bundle = [id, null, Action.DELETE, user.id]
                    this.connection.sendMessage(bundle)
                }
            )
        }
    }

    onStateReceived(bundle) {
        const { internalState, user } = this.state
        const [idx, value, action, userId] = bundle

        if (userId === user.id) return

        if (action === Action.ADD) {
            this.add(internalState, value, idx)
        } else if (action === Action.DELETE) {
            this.delete(internalState, idx, true)
        } else if (action === Action.UPDATE) {
            this.update(internalState, idx, value, userId)
        }
    }

    addCodeEditor() {
        const { internalState, user } = this.state
        this.add(
            internalState,
            Type.CODE,
            null,
            (id) => {
                const bundle = [id, Type.CODE, Action.ADD, user.id]
                this.connection.sendMessage(bundle)
            }
        )
    }

    addTextEditor() {
        const { internalState, user } = this.state
        this.add(
            internalState,
            Type.TEXT,
            null,
            (id) => {
                const bundle = [id, Type.TEXT, Action.ADD, user.id]
                this.connection.sendMessage(bundle)
            }
        )
    }

    addDiagramEditor() {
        const { internalState, user } = this.state
        this.add(
            internalState,
            Type.DIAGRAM,
            null,
            (id) => {
                const bundle = [id, Type.DIAGRAM, Action.ADD, user.id]
                this.connection.sendMessage(bundle)
            }
        )
    }

    getComponents() {
        const { internalState } = this.state
        return Object.entries(internalState).map(([idx, comp]) => {
            if (comp.type === Type.CODE) {
                return <CodeEditor
                    key={idx}
                    value={comp.value}
                    onDelete={this.onDelete(idx)}
                    onChange={this.onChange(idx)}
                />
            } else if (comp.type === Type.TEXT) {
                return <TextEditor
                    key={idx}
                    value={comp.value}
                    onDelete={this.onDelete(idx)}
                    onChange={this.onChange(idx)}
                    requesterId={this.state.requesterId}
                    shouldUpdate={this.state.requesterId === this.state.user.id}
                />
            } else if (comp.type === Type.DIAGRAM) {
                return <DiagramEditor
                    key={idx}
                    value={comp.value}
                    onDelete={this.onDelete(idx)}
                    onChange={this.onChange(idx)}
                    shouldUpdate={this.state.requesterId !== this.state.user.id}
                />
            }
        })
    }

    render() {
        return (
            this.state.user && <Stack
                spacing={2}
                justifyContent='center'
                alignItems='center'
                sx={{ width: '100%', pt: 5, pb: 5 }}
            >
                <Title title={this.state.title} noteId={this.noteId} />
                {this.getComponents()}
                <ButtonGroup variant='outlined' aria-label="outlined button group">
                    <Button
                        startIcon={<AddIcon />}
                        onClick={this.addCodeEditor}>
                        Code
                    </Button>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={this.addTextEditor}>
                        Text
                    </Button>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={this.addDiagramEditor}>
                        Diagram
                    </Button>
                </ButtonGroup>
            </Stack>
        )
    }

}

export default withRouter(MeetingNote)