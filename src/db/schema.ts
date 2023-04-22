import { Schema } from "mongoose";
import { Channel, DataStore, Message, TokenPair, User } from "../interfaces";

const messageSchema = new Schema<Message>({
    messageId: Number,
    uId: Number,
    message: String,
    timeSent: Number,
})

const channelSchema = new Schema<Channel>({
    channelId: Number,
    name: String,
    ownerMembers: Number,
    allMembers: Number,
    messages: [messageSchema],
})

const tokenPairSchema = new Schema<TokenPair>({
    token: String,
    uId: Number,
})

const userSchema = new Schema<User>({
    uId: Number,
    nameFirst: String,
    nameLast: String,
    email: String,
    password: String,
    handleStr: String,
    globalPerm: Number,
})