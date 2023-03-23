import { getData, setData} from './dataStore';

export function messageSendV1(token: string, channelId: number, message: string): Error | MessageId {
    return{};
}

export function messageSendDmV1(token: string, dmId: number, message: string): Error | MessageId {
    
}
export function messageEditV1(token: string, messageId: number, message: string): Error | object {
    return{};
}
export function messageRemoveV1(token: string, messageId: number): Error | object {
    return{};
}
