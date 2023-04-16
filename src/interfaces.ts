export interface Message {
    messageId: number;
    uId: number;
    message: string;
    timeSent: number;
}

export interface Channel {
    channelId: number;
    name: string;
    ownerMembers: number[];
    allMembers: number[];
    messages: Message[];
    isPublic: boolean;
}

export interface TokenPair {
    token: string;
    uId: number;
}

export interface User {
    uId: number;
    nameFirst: string;
    nameLast: string;
    email: string;
    password: string;
    handleStr: string;
    globalPerm: number;
}

export interface DM {
    dmId: number;
    name: string;
    ownerId: number;
    uIds: number[];
    messages: Message[];
}

export interface DataStore {
    pwReset: any;
    users: User[];
    channels: Channel[];
    tokens: TokenPair[];
    lastAuthUserId: number;
    lastChannelId: number;
    lastMessageId: number,
    dms: DM[],
    lastDmId: number,
}

export interface Profile {
    uId: number;
    nameFirst: string;
    nameLast: string;
    email: string;
    handleStr: string;
}
 
export interface PwReset {
    uId: number;
    code: string;
}
export interface Notif {
    channelId: number;
    dmId: number;
    notificationMessage: string;
}
