import React from 'react'
import {
    Grid,
    Paper,
    Button,
    Drawer,
    Box
} from '@mui/material'
import { withRouter } from 'react-router-dom'
import ConnectionList from 'main_views/chat/ConnectionsList'
import Messaging from 'main_views/chat/Messaging'
import OtherLinks from 'main_views/OtherLinks'


class Chat extends React.Component {
    state = {
        user: null,
        connection: null,
        uniqueId: Math.random(),
        drawerOpen: false,
    }

    constructor(props) {
        super(props)
        this.getUsers = this.getUsers.bind(this)
    }

    getUsers(connection, user, click) {

        if (click) {
            this.setState({
                user: user,
                connection: connection.tutor ? connection.tutor : connection,
                uniqueId: Math.random(),
                drawerOpen: true,
            })
        } else {
            this.setState({
                user: user,
                connection: connection.tutor ? connection.tutor : connection,
            })
        }
    }

    renderDestop() {
        return <Grid container spacing={2} columns={12} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Grid item xs={3}>
                <Paper sx={{ height: '90vh' }}>
                    <ConnectionList getUsers={this.getUsers} />
                </Paper>
            </Grid>
            <Grid item xs={6}>
                {this.state.connection && this.state.user && <Messaging
                    key={this.state.uniqueId}
                    connection={this.state.connection}
                    userId={this.state.user.uid}
                />}
            </Grid>
            <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                <OtherLinks />
            </Grid>
        </Grid>
    }

    renderMobile() {

        const toggleDrawer = (open) => {
            this.setState({ 
                drawerOpen: open,
                connection: null,
                user: null 
            })
        }

        return <Box sx={{ display: { xs: '', md: 'none' } }}>
            <ConnectionList getUsers={this.getUsers} />
            <Drawer sx={{ display: { xs: '', md: 'none' } }}
                anchor='bottom'
                open={this.state.drawerOpen}
                onClose={() => toggleDrawer(false)}
            >
                <Button onClick={() => toggleDrawer(false)}> Close </Button>
                {this.state.connection && this.state.user && <Messaging
                    minHeight='90vh'
                    key={this.state.uniqueId}
                    connection={this.state.connection}
                    userId={this.state.user.uid}
                />}
            </Drawer>
        </Box>
    }

    render() {

        return <>
            {this.renderMobile()}
            {this.renderDestop()}
        </>
    }
}

export default withRouter(Chat)