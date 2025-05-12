import axios from 'axios'
import { getBaseAPI } from 'api/marketplaceDAO'


export class LoggingDAO {

    static sendLogs({error, errorInfo}) {
        axios.post(`${getBaseAPI()}/react-logging/`, { 'error': error, 'error_info': errorInfo })
    }
}