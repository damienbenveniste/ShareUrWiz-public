import React from 'react'
import Diagram, { ViewToolbar, MainToolbar, Command } from 'devextreme-react/diagram'
import {
    Stack,
    Button,
    Paper
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ErrorBoundary from 'components/ErrorBoundary'


export default class DiagramEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            diagramRef: null,
            style: {position: 'relative'}
        }

        this.onRefChange = this.onRefChange.bind(this)
        this.onFullScreen = this.onFullScreen.bind(this)
        this.initComponent = true
    }

    onRefChange = node => {
        this.setState({ diagramRef: node });
    }

    componentDidUpdate() {
        if (!this.state.diagramRef) return

        const { value, shouldUpdate } = this.props

        if (!shouldUpdate && !this.initComponent) return
        this.initComponent = false

        const diagram = this.state.diagramRef.instance
        diagram.import(value)
    }

    onFullScreen(fullScreen) {
        if (fullScreen) {
            this.setState({style: {position: 'absolute'}})
        } else {
            this.setState({style: {position: 'relative'}})
        }
    }

    render() {

        const { onChange, onDelete } = this.props

        return <Paper sx={{ width: '100%' }}>
            <Stack sx={{ width: '100%' }}>
                <Stack
                    direction='row'
                    spacing={1}
                    justifyContent='flex-end'
                >
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={onDelete}>
                        Delete
                    </Button>
                </Stack>
                <div className="demo-container">
                    <ErrorBoundary>
                        <Diagram
                            style={this.state.style}
                            useNativeScrolling={false}
                            onOptionChanged={(e) => {
                                if (e.name === 'fullScreen') {
                                    this.onFullScreen(e.value)
                                }
                            }}
                            onRequestEditOperation={(e) => {
                                onChange(e.component.export())
                            }}
                            ref={this.onRefChange} >
                            <MainToolbar visible={true} />
                            <ViewToolbar/>
                        </Diagram>
                    </ErrorBoundary>
                </div>
            </Stack>
        </Paper>
    }


}
