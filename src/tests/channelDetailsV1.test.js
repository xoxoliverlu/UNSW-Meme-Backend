import { authRegisterV1 } from '../auth';
import { channelDetailsV1 } from '../channel'
import { channelsCreateV1 } from '../channels';
import { clearV1 } from '../other'

describe('Invalid input tests.', () => {
    test('Invalid channelId.', () => {
        clearV1();
        const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const authId = register.authUserId;
        const newChannel = channelsCreateV1(authId, 'Channel1', false);
        const channelID = 'wrong';
        const channelDetails = channelDetailsV1(authId, channelID);
        expect(channelDetails).toEqual({error: 'error'});
    });
    test('Invalid authUserId.', () => {
        clearV1();
        const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const authId = 'xyz';
        const newChannel = channelsCreateV1(authId, 'Channel1', false);
        const channelID = newChannel.channelID;
        const channelDetails = channelDetailsV1(authId, channelID);
        expect(channelDetails).toEqual({error: 'error'});
    });
    test('Unaithourised authUserId.', () => {
        clearV1();
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
    clearV1();
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