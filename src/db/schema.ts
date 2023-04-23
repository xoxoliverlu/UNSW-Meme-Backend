import { Schema } from "mongoose";
import { Channel, ChannelStat, ChannelsExistStat, DM, DataStore, DmStat, DmsExistStat, Message, MessageStat, Notif, Profile, PwReset, TokenPair, User, channelStat, dmStat, messageStat, msgsExistStat, pwReset } from "../interfaces";


export const messageSchema = new Schema<Message>({
    messageId: Number,
    uId: Number,
    message: String,
    timeSent: Number,
})


const channelSchema = new Schema<Channel>({
    channelId: Number,
    name: String,
    ownerMembers: [Number],
    allMembers: [Number],
    messages: [messageSchema],
})

const tokenPairSchema = new Schema<TokenPair>({
    token: String,
    uId: Number,
})

export const userSchema = new Schema<User>({
    uId: Number,
    nameFirst: String,
    nameLast: String,
    email: String,
    password: String,
    handleStr: String,
    globalPerm: Number,
})

const dmSchema = new Schema<DM>({
    dmId: Number,
    name: String,
    ownerId: String,
    uIds: [Number],
    messages: [messageSchema],
})

const profileSchema = new Schema<Profile>({
    uId: Number,
    nameFirst: String,
    nameLast: String,
    email: String,
    handleStr: String,
})

const pwResetSchema = new Schema<PwReset>({
    uId: Number,
    code: String,
})

const notifSchema = new Schema<Notif>({
    channelId: Number,
    dmId: Number,
    notificationMessage: String,
})

const channelStatSchema = new Schema<channelStat>({
    numChannelsJoined: Number,
    timeStamp: Number
})

const channelsStatSchema = new Schema<ChannelStat>({
    uId: Number,
    stat: [channelStatSchema],
})

const dmStatSchema = new Schema<dmStat>({
    numDmsJoined: Number,
    timeStamp: Number,
})

const dmsStatSchema = new Schema<DmStat>({
    uId: Number,
    stat: [dmStatSchema],
})

const messageStatSchema = new Schema<messageStat>({
    numMessagesSent: Number,
    timeStamp: Number,
})

const messagesStatSchema = new Schema<MessageStat>({
    uId: Number,
    stat: [messageStatSchema]
})

const channelsExistStatSchema = new Schema<ChannelsExistStat>({
    numChannelsExist: Number,
    timeStamp: Number,
})

const dmsExistStatSchema = new Schema<DmsExistStat>({
    numDmsExist: Number,
    timeStamp: Number,
})

const msgsExistStatSchema = new Schema<msgsExistStat>({
    numMessagesExist: Number,
    timeStamp: Number,
})


export const dataStoreSchema = new Schema<DataStore>({
    pwReset: [pwResetSchema],
    users: [userSchema],
    channels: [channelSchema],
    tokens: [tokenPairSchema],
    lastAuthUserId: Number,
    lastChannelId: Number,
    lastMessageId: Number,
    dms: [dmSchema],
    lastDmId: Number,
    channelStats: [channelsStatSchema],
    dmStats: [dmsStatSchema],
    messageStats: [messagesStatSchema],
    channelsExistStat: [channelsExistStatSchema],
    dmsExistStat: [dmsExistStatSchema],
    msgsExistStat: [msgsExistStatSchema],
})