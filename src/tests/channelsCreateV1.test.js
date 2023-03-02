import { authRegisterV1 } from './auth';
import { channelsCreateV1 } from './channels';
import { clearV1 } from './other';
import { getData, setData } from './dataStore'


test('Channel creation success', () => {
    clearV1();
    authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, 'jaydensChannel', true)
    expect(channelCreationValid.channelId).toBe(0)
}) 
test('Channel creation success 2', () => {
    clearV1();
    authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, 'jaydensChannel', true)
    const channelCreationValid1 = channelsCreateV1(0, 'jaydensGang', true)
    expect(channelCreationValid1.channelId).toBe(1)
})
test('Channel name already exists', () => {
    clearV1();
    authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, 'jaydensGang', true)
    const channelCreationValid1 = channelsCreateV1(0, 'jaydensGang', true)
    expect(channelCreationValid1).toMatchObject({error: 'Channel name already exists'})
})
test('authUserId not in data', () => {
    clearV1();
    authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(2, 'jaydensGang', true)
    expect(channelCreationValid).toMatchObject({error: 'User is not valid'})
}) 
test('Channel name too short', () => {
    clearV1();
    authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, '', true)
    expect(channelCreationValid).toMatchObject({error: 'channel name is too short'})
})
test('Channel name too long', () => {
    clearV1();
    authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, 'hellomynameisETHANPHAN123', true)
    expect(channelCreationValid).toMatchObject({error: 'channel name is too long'})
})
test('Channel is public', () => {
    clearV1();
    authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, 'Hayden1234', true)
    const data = getData();
    expect(data.channels['Jayden1234'].isPublic).toBe(true)
})
test('Channel is not public', () => {
    clearV1();
    authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, 'Hayden134', false)
    const data = getData();
    expect(data.channels['Jayden134'].isPublic).toBe(false)
}) 