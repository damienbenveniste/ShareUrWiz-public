import React, { useEffect, useState } from 'react'
import { ChatDAO } from 'api/chatDAO'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from 'modals/login/firebase_auth'
import PersonIcon from '@mui/icons-material/Person'
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Grid,
    TablePagination,
    Avatar
} from '@mui/material'

function ConnectionRow(props) {

    const user = props.user
    var picture = null
    var username = null

    if (user.tutor) {
        picture = user.tutor.picture
        username = user.tutor.first_name.concat(' ', user.tutor.last_name)
    } else {
        username = user.username
    }
    var options = { year: 'numeric', month: 'short', day: 'numeric' }
    const date = new Date(props.lastUpdated)

    return (
        <TableRow
            hover
            selected={props.selected}
            onClick={props.onClick}
        >
            <TableCell >
                <Grid container>
                    <Grid item xs={2}>
                        <Avatar
                            src={picture}
                            alt={username}
                        >
                            <PersonIcon />
                        </Avatar>
                    </Grid>
                    <Grid item xs={6} >
                        <Typography variant='h6'>
                            {username}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} >
                        <Typography >
                            {date.toLocaleDateString('en-US', options)}
                        </Typography>
                    </Grid>
                </Grid>
            </TableCell>
        </TableRow >
    )
}


export default function ConnectionList(props) {

    const [connections, setConnections] = useState([])
    const [page, setPage] = useState(1)
    const [user, loading] = useAuthState(Auth.auth())
    const [selectedNum, setSelectedNum] = useState(0)
    const [chatLoading, setChatLoading] = useState(false)

    const rows = connections.filter((room) => {
        const connection = (room.users[0].id === user.uid) ? room.users[1] : room.users[0]
        return connection !== undefined
    }).map((room, index) => {
        const connection = (room.users[0].id === user.uid) ? room.users[1] : room.users[0]
        return <ConnectionRow
            user={connection}
            key={room.id}
            lastUpdated={room.last_updated}
            selected={selectedNum === index}
            onClick={() => {
                setSelectedNum(index)
                props.getUsers(connection, user, true)
            }}
        />
    })

    const handleChangePage = (event, newPage) => {
        setPage(newPage + 1)
        setSelectedNum(0)
    }

    useEffect(() => {
        if (loading) {
            return
        }

        setChatLoading(true)
        ChatDAO.getConnections({
            user_id: user.uid,
            page: page,
            onSuccess: (res) => {
                setChatLoading(false)
                if (res.data.results.length !== 0) {
                    setConnections(res.data.results)
                    let room = res.data.results[0]
                    let connection = (room.users[0].id === user.uid) ? room.users[1] : room.users[0]
                    props.getUsers(connection, user, false)
                }
            }
        })
    }, [user, loading])

    useEffect(() => {
        if (loading) {
            return
        }
        setChatLoading(true)
        ChatDAO.getConnections({
            user_id: user.uid,
            page: page,
            onSuccess: (res) => {
                setChatLoading(false)
                if (res.data.results.length !== 0) {
                    setConnections(res.data.results)
                    let room = res.data.results[0]
                    let connection = (room.users[0].id === user.uid) ? room.users[1] : room.users[0]
                    props.getUsers(connection, user, false)
                }
            }
        })
    }, [page])

    return (
        <TableContainer sx={{ height: '100%' }}>
            <Table stickyHeader aria-label='simple table'>
                <TableHead >
                    <TableRow>
                        <TableCell>
                            <Typography variant='h5'>
                                Messaging
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[]}
                            colSpan={1}
                            count={connections.length}
                            rowsPerPage={connections.length}
                            page={page - 1}
                            onPageChange={handleChangePage}
                        />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {chatLoading && <TableRow><TableCell ><CircularProgress /></TableCell ></TableRow>}
                    {!chatLoading && rows}
                </TableBody>
            </Table>
        </TableContainer>
    )
}