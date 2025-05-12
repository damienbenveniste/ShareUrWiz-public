
import { useState } from 'react'

import {
    Stack,
    Paper,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
} from '@mui/material'
import InfiniteScroll from 'react-infinite-scroller'
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4'
import DescriptionIcon from '@mui/icons-material/Description'
import { NoteDAO } from 'api/noteDAO'
import Constant from 'utils/constants'
import { Link } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'


function BadConnection(props) {
    return <Stack
        justifyContent='center'
        alignItems='center'>
        <SignalWifiStatusbarConnectedNoInternet4Icon
            color='disabled'
            sx={{ height: 50, width: 50 }} />
        <Typography variant='h6' color='gray'>
            Oops something went wrong!
        </Typography>
    </Stack>
}

const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }

function NoteCard(props) {

    const [deleted, setDeleted] = useState(false)
    const [loading, setLoading] = useState(false)

    const note = props.note

    const deleteNote = () => {
        setLoading(true)
        NoteDAO.deleteNote({
            noteId: note.id,
            onSuccess: () => {
                setDeleted(true)
                setLoading(false)
            },
            onFailure: () => setLoading(false)
        })
    }

    return (deleted ? null : <ListItem
        secondaryAction={
            <IconButton onClick={deleteNote}>
                {loading ? <CircularProgress /> : <DeleteIcon />}
            </IconButton>
        }>
        <ListItemIcon>
            <DescriptionIcon />
        </ListItemIcon>
        <ListItemText
            primary={
                <Link
                    to={Constant.URL.MEETING_NOTE + '/' + note.id}
                    target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}>
                    {note.title}
                </Link>
            }
            secondary={(new Date(note.time_created)).toLocaleString('en-US', options)}
        >
        </ListItemText>
    </ListItem>)
}


export function NoteScroller({ userId, ...restProps }) {

    const [page, setPage] = useState(1)
    const [notes, setNotes] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [connectionOk, setConnectionOk] = useState(true)


    const fetchData = () => {

        NoteDAO.getNotes({
            user_id: userId,
            page: page,
            onSuccess: (res) => {
                setHasMore(res.total_pages > page)
                setNotes([...notes, ...res.results])
                setConnectionOk(true)
                setPage(page + 1)
            },
            onFailure: () => {
                setConnectionOk(false)
            }
        })
    }

    return <Paper >
        {connectionOk ? <InfiniteScroll
            pageStart={0}
            loadMore={fetchData}
            hasMore={hasMore}
            useWindow={false}
            loader={<CircularProgress key={0} />}>
            <List>
                {notes.map((note) => <NoteCard key={note.id} note={note} />)}
            </List>
        </InfiniteScroll> : <BadConnection />}
    </Paper>
}