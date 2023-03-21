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

