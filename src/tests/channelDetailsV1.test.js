import { authRegisterV1 } from '../auth.js';
import { channelDetailsV1 } from '../channel.js'
import { channelsCreateV1 } from '../channels.js';
import { clearV1 } from '../other.js'

beforeEach(() => {
    clearV1();
});

describe('Invalid input tests.', () => {
    test('Invalid channelId.', () => {
        const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const authId = register.authUserId;
        const newChannel = channelsCreateV1(authId, 'Channel1', false);
        const channelID = newChannel.channelId + 1;
        const channelDetails = channelDetailsV1(authId, channelID);
        expect(channelDetails).toEqual({error: 'error'});
    });
    test('Invalid authUserId.', () => {
        const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const authId = register.authUserId;
        const newChannel = channelsCreateV1(authId, 'Channel1', false);
        const channelID = newChannel.channelID;
        // Send invalid channelId
        const channelDetails = channelDetailsV1(authId + 1, channelID);
        expect(channelDetails).toEqual({error: 'error'});
    });
    test('Unauthorised authUserId.', () => {
        const registerValid = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const authValid = registerValid.authUserId;
        const registerInvalid = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
        const authInvalid = registerInvalid.authUserId;
        const newChannel = channelsCreateV1(authValid, 'Channel1', false);
        const channelID = newChannel.channelID;
        const channelDetails = channelDetailsV1(authInvalid, channelID);
        expect(channelDetails).toEqual({error: 'error'});
    });
});

test('Succesful ChannelDetailsV1 test.', () => {
    const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = register.authUserId;
    const newChannel = channelsCreateV1(authId, 'Channel1', false);
    const channelID = newChannel.channelID;
    const channelDetails = channelDetailsV1(authId, channelID);
    expect(channelDetails).toEqual({
        name: 'Fady',
        ownerMembers: [
            {
            uId: authId,
            email: 'fadyS@gmail.com',
            nameFirst: 'Fady',
            nameLast: 'Sadek',
            handleStr: 'fadysadek',
            }
        ],
        allMembers: [
            {
            uId: authId,
            email: 'fadyS@gmail.com',
            nameFirst: 'Fady',
            nameLast: 'Sadek',
            handleStr: 'fadysadek',
            }
        ],
    });
});