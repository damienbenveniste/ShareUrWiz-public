
import axios from 'axios'
import { getBaseAPI } from 'api/marketplaceDAO'


export class ChatDAO {

    static getConnections({
        user_id,
        page,
        onSuccess,
    } = {}) {

        const params = {
            user_id: user_id,
        }

        axios
            .get(`${getBaseAPI()}/chat/rooms/?page=${page}`, { params: params })
            .then((res) => {
                onSuccess(res)
            })
    }

    static getMessages({
        user_id,
        connection_id,
        page,
        onSuccess,
    } = {}) {

        const params = {
            user_id: user_id,
            connection_id: connection_id
        }

        axios
            .get(`${getBaseAPI()}/chat/messages/?page=${page}`, { params: params })
            .then((res) => {
                onSuccess(res)
            })
    }

}