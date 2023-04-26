import { model } from 'mongoose';
import { dataStoreSchema, messageSchema, userSchema } from './schema';
import { DataStore, Message, User } from '../interfaces';

export const MessageM = model<Message>('Message', messageSchema);
export const DataStoreM = model<DataStore>('DataStore', dataStoreSchema);
export const UserM = model<User>('User', userSchema);
