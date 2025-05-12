import { getBaseAPI } from 'api/marketplaceDAO'


export default class SocketConnection {

    constructor({onMessageReceived: receiveMessageCallback}) {
        this.activeConnection = false
        this.ws = null
        this.state = null
        this.receiveMessageCallback = receiveMessageCallback

        this.sendMessage = this.sendMessage.bind(this)
        this.getURL = this.getURL.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
    }

    getURL(baseUrl, room) {
        const host = getBaseAPI({ remove_http: true })
        const protocol = (host === 'localhost:8000') ? 'ws' : 'wss'
        return `${protocol}://${host}/ws/${baseUrl}/${room}/`
    }

    connect(baseUrl, room) {
        const url = this.getURL(baseUrl, room)
        var ws = new WebSocket(url)
        ws.onopen = () => {
            this.activeConnection = true
        }

        ws.onmessage = e => {
            this.onMessageReceived(e.data)
        }

        ws.onclose = e => {
            if (this.activeConnection) this.connect(url)
        }

        ws.onerror = (err) => {
            console.error('Socket encountered error: ', err, 'Closing socket')
            this.activeConnection = false
            ws.close()
        }

        this.ws = ws
    }

    onMessageReceived(message) {
        const state = JSON.parse(message)
        this.receiveMessageCallback(state)
    }

    sendMessage(text) {

        const message = {
            message: text
        }
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message))
        }
    }

}