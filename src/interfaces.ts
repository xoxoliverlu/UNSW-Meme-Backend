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
    pwReset: pwReset[];
    users: User[];
    channels: Channel[];
    tokens: TokenPair[];
    lastAuthUserId: number;
    lastChannelId: number;
    lastMessageId: number,
    dms: DM[],
    lastDmId: number,
    channelStats: ChannelStat[],
    dmStats: DmStat[],
    messageStats: MessageStat[],
    channelsExistStat: ChannelsExistStat[],
    dmsExistStat: DmsExistStat[],
    msgsExistStat: msgsExistStat[],
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

export interface channelStat {
    numChannelsJoined: number;
    timeStamp: number;
}

export interface ChannelStat {
    uId: number;
    stat: channelStat[];
}

export interface dmStat {
    numDmsJoined: number;
    timeStamp: number;
}

export interface DmStat {
    uId: number;
    stat: dmStat[];
}

export interface messageStat {
    numMessagesSent: number;
    timeStamp: number;
}

export interface MessageStat {
    uId: number;
    stat: messageStat[];
}


export interface ChannelsExistStat {
    numChannelsExist: number;
    timeStamp: number;
}

export interface DmsExistStat {
    numDmsExist: number;
    timeStamp: number;
}

export interface msgsExistStat {
    numMessagesExist: number;
    timeStamp: number;
}

export interface pwReset {
    uId: number,
    code: string,
}
