import React, { Component } from 'react'
import {
    Stack,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Button,
    Paper
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-jsx'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'

const languages = [
    'javascript',
    'java',
    'python',
    'xml',
    'ruby',
    'sass',
    'markdown',
    'mysql',
    'json',
    'html',
    'handlebars',
    'golang',
    'csharp',
    'elixir',
    'typescript',
    'css'
]

const themes = [
    'monokai',
    'github',
    'tomorrow',
    'kuroir',
    'twilight',
    'xcode',
    'textmate',
    'solarized_dark',
    'solarized_light',
    'terminal'
]

languages.forEach(lang => {
    require(`ace-builds/src-noconflict/mode-${lang}`)
    require(`ace-builds/src-noconflict/snippets/${lang}`)
})

themes.forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`))

const defaultValue = `function onLoad(editor) {
    console.log("i've loaded");
  }`

export default class CodeEditor extends Component {

    setTheme(e) {
        this.setState({
            theme: e.target.value
        });
    }
    setMode(e) {
        this.setState({
            mode: e.target.value
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            theme: "solarized_light",
            mode: "javascript",
        };
        this.setTheme = this.setTheme.bind(this);
        this.setMode = this.setMode.bind(this);
    }
    render() {

        const { onChange, onDelete, value } = this.props

        return <Paper sx={{width:'100%'}}>
            <Stack sx={{width:'100%'}}>
                <Stack
                    direction='row'
                    spacing={1}
                    justifyContent='flex-end'  
                >
                    <FormControl
                        size='small'
                        sx={{ width: 200 }}>
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={this.state.mode}
                            label="Language"
                            variant='standard'
                            onChange={this.setMode}
                        >
                            {languages.map(lang => (
                                <MenuItem value={lang} key={lang}>{lang}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl
                        size='small'
                        sx={{ width: 200 }}>
                        <InputLabel>Theme</InputLabel>
                        <Select
                            value={this.state.theme}
                            variant='standard'
                            label="Theme"
                            onChange={this.setTheme}
                        >
                            {themes.map(theme => (
                                <MenuItem value={theme} key={theme}>{theme}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        size='small'
                        startIcon={<DeleteIcon />}
                        onClick={onDelete}>
                        Delete
                    </Button>
                </Stack>
                <AceEditor
                    placeholder='Type your code here'
                    width='100%'
                    height='10'
                    wrapEnabled={true}
                    mode={this.state.mode}
                    theme={this.state.theme}
                    name="blah2"
                    onChange={onChange}
                    value={value}
                    fontSize={16}
                    minLines={10}
                    maxLines={50}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    setOptions={{
                        useWorker: false,
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 2
                    }}
                />
            </Stack>
        </Paper>
    }
}