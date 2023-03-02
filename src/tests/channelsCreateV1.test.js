import { authRegisterV1 } from '../auth.js';
import { channelsCreateV1, channelsListV1 } from '../channels.js';
import { clearV1 } from '../other.js';

beforeEach(() => {
    clearV1();
});

describe('Valid channelId produced', () => {
    test('Channel creation success for a public channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, 'jaydensChannel', true);
        const channelId2 = channelsListV1(user1.authUserId);
        expect(channelCreationValid.channelId).toMatchObject(channels[channelId2].channelId);
    });
    test('Channel creation success for a private channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, 'jaydensChannel', false);
        const channelId2 = channelsListV1(user1.authUserId);
        expect(channelCreationValid.channelId).toMatchObject(channels[channelId2].channelId);
    });
    // Edge cases
    test('Valid channel name - exactly one character - public channel', () => {
        clearV1();
        const user1 = authRegisterV1('Akanksha.sood@gmail.com', '12345678', 'Akanksha', 'Sood');
        const channelName1 = 'C';
        const channelId1 = channelsCreateV1(user1, channelName1, true);
        const channelId2 = channelsListV1(user1.uId);
        expect(channelId1.channelId1).toMatchObject(channels[channelId2].channelId);
    });
    test('Valid channel name - exactly twenty characters - private channel', () => {
        clearV1();
        const user2 = authRegisterV1('hayden.smith@gmail.com', 'haydensmith', 'hayden', 'smith');
        const channelName2 = 'This is a pr channel';
        const channelId3 = channelsCreateV1(user2.authUserId, channelName2, false);
        const channelId4 = channelsListV1(user2.authUserId);
        expect(channelId3.channelId3).toMatchObject(channels[channelId4].channelId);
    });
});

describe('Invalid inputs', () => {
    test('Invalid authUserId', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId + 1, 'jaydensGang', true);
        expect(channelCreationValid).toMatchObject({error: 'User is not valid'});
    });
    test('Channel name too short - public channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, '', true);
        expect(channelCreationValid).toMatchObject({error: 'channel name is too short'});
    });
    test('Channel name too short - private channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, '', false);
        expect(channelCreationValid).toMatchObject({error: 'channel name is too short'});
    })
    test('Channel name too long - public channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, 'hellomynameisETHANPHAN123', true);
        expect(channelCreationValid).toMatchObject({error: 'channel name is too long'});
    });
    test('Channel name too long - private channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, 'hellomynameisETHANPHAN123', false);
        expect(channelCreationValid).toMatchObject({error: 'channel name is too long'});
    });
});