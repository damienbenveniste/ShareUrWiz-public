

import {
    Button,
    Stack
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { NoteDAO } from 'api/noteDAO'
import Constant from 'utils/constants'
import { NoteScroller } from 'api/componentWrappers/NoteScroller'


export default function MeetingNotesList(props) {

    const createNote = () => {
        NoteDAO.createNote({
            participants: [props.user.id],
            onSuccess: (res) => {
                const hostname = window.location.hostname
                const protocol = window.location.protocol
                const port = window.location.port
                const baseName = port ? `${hostname}:${port}` : hostname
                const url = `${protocol}//${baseName}${Constant.URL.MEETING_NOTE}/${res.id}`
                window.open(url)
            },
            onFailure: () => { }
        })
    }

    return <Stack sx={{ mb: 1, mt: {xs: 5, md: 0}}} spacing={1}>
        <Button 
        startIcon={<AddIcon />}
        variant='contained' 
        onClick={createNote}>
            Create a note
        </Button>
        <NoteScroller userId={props.user.id}/>
    </Stack>

}