import axios from 'axios'
import { getBaseAPI } from './marketplaceDAO'


export class NoteDAO {

    static createNote({
        participants,
        onSuccess,
        onFailure
    }) {

        axios.post(`${getBaseAPI()}/meeting-note/notes/`, { 'participants_id': participants })
        .then((res) => {
            onSuccess(res.data)
        })
        .catch(err => {
            const message = 'Oops something went wrong!'
            onFailure(message)
        })

    }

    static getNote({
        noteId,
        onSuccess,
        onFailure
    }) {
        axios.get(`${getBaseAPI()}/meeting-note/notes/${noteId}`)
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

    static getNotes({
        userId,
        page,
        onSuccess,
        onFailure
    }) {
        axios.get(`${getBaseAPI()}/meeting-note/notes/?page=${page}`, {user_id: userId})
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

    static updateNote({
        noteId,
        title,
        onSuccess,
        onFailure
    }) {
        axios.patch(`${getBaseAPI()}/meeting-note/notes/${noteId}/`, { 'title': title })
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

    static deleteNote({
        noteId,
        onSuccess,
        onFailure
    }) {
        axios.delete(`${getBaseAPI()}/meeting-note/notes/${noteId}/`)
        .then((res) => {
            if (res.status === 204) {
                const message = 'This Note Cell has been deleted'
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

    static createNoteCell({
        type,
        noteId,
        onSuccess,
        onFailure,
    }) {

        axios.post(`${getBaseAPI()}/meeting-note/note-cells/`, { 'type': type, 'note_id': noteId })
        .then((res) => {
            onSuccess(res.data)
        })
        .catch(err => {
            const message = 'Oops something went wrong!'
            onFailure(message)
        })
    }

    static deleteNoteCell({
        noteCellId,
        onSuccess,
        onFailure
    }) {
        axios.delete(`${getBaseAPI()}/meeting-note/note-cells/${noteCellId}/`)
        .then((res) => {
            if (res.status === 204) {
                const message = 'This Note Cell has been deleted'
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

    static updateNoteCell({
        noteCellId,
        content,
        onSuccess,
        onFailure
    }) {
        axios.patch(`${getBaseAPI()}/meeting-note/note-cells/${noteCellId}/`, { 'content': content })
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