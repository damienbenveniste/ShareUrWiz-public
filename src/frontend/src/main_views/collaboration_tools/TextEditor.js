import React, { Component } from 'react'
import {
    Stack,
    Button,
    Paper
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import HtmlEditor, { Toolbar, MediaResizing, Item } from 'devextreme-react/html-editor'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import 'devextreme/ui/html_editor/converters/markdown'

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];
const headerValues = [false, 1, 2, 3, 4, 5]


export default class TextEditor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selection: null
        }

        this.editorRef = React.createRef()
    }


    componentDidUpdate() {

        if (!this.editorRef || !this.state.selection) return

        const editor = this.editorRef.current.instance
        editor.setSelection(this.state.selection)
    }

    render() {

        const { onChange, onDelete, value } = this.props

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
                <div className="widget-container">
                    <HtmlEditor
                        ref={this.editorRef}
                        height="auto"
                        style={{ maxHeight: '75%', minHeight: 250 }}
                        value={value}
                        placeholder='Type your text here'
                        styleMode='underlined'
                        focusStateEnabled={false}
                        activeStateEnabled={false}
                        onFocusOut={e => onChange(e.value)}
                        onValueChanged={(e) => {
                            this.setState({ selection: e.component.getSelection() })
                            onChange(e.value)
                        }}>
                        <MediaResizing enabled={true} />
                        <Toolbar multiline={false}>
                            <Item name="undo" />
                            <Item name="redo" />
                            <Item name="separator" />
                            <Item
                                name="size"
                                acceptedValues={sizeValues}
                            />
                            <Item
                                name="font"
                                acceptedValues={fontValues}
                            />
                            <Item name="separator" />
                            <Item name="bold" />
                            <Item name="italic" />
                            <Item name="strike" />
                            <Item name="underline" />
                            <Item name="separator" />
                            <Item name="alignLeft" />
                            <Item name="alignCenter" />
                            <Item name="alignRight" />
                            <Item name="alignJustify" />
                            <Item name="separator" />
                            <Item name="orderedList" />
                            <Item name="bulletList" />
                            <Item name="separator" />
                            <Item
                                name="header"
                                acceptedValues={headerValues}
                            />
                            <Item name="separator" />
                            <Item name="color" />
                            <Item name="background" />
                            <Item name="separator" />
                            <Item name="link" />
                            <Item name="image" />
                            <Item name="separator" />
                            <Item name="clear" />
                            <Item name="codeBlock" />
                            <Item name="blockquote" />
                            <Item name="separator" />
                            <Item name="insertTable" />
                            <Item name="deleteTable" />
                            <Item name="insertRowAbove" />
                            <Item name="insertRowBelow" />
                            <Item name="deleteRow" />
                            <Item name="insertColumnLeft" />
                            <Item name="insertColumnRight" />
                            <Item name="deleteColumn" />
                        </Toolbar>
                    </HtmlEditor>
                </div>

            </Stack>
        </Paper>
    }
}