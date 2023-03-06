import { authRegisterV1 } from './auth';
import { channelsCreateV1 } from './channels';
import { clearV1 } from './other';
import { getData, setData } from './dataStore'


test('Channel creation success', () => {
    clearV1();
    authRegisterV1('hayhay123@gmail.com','hayhay123', 'Hayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, 'haydensChannel', true)
    expect(channelCreationValid.channelId).toBe(0)
}) 
test('Channel creation success 2', () => {
    clearV1();
    authRegisterV1('hayhay123@gmail.com','hayhay123', 'Hayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, 'haydensChannel', true)
    const channelCreationValid1 = channelsCreateV1(0, 'haydensLads', true)
    expect(channelCreationValid1.channelId).toBe(1)
})
test('Channel name already exists', () => {
    clearV1();
    authRegisterV1('hayhay123@gmail.com','hayhay123', 'Hayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, 'haydensLads', true)
    const channelCreationValid1 = channelsCreateV1(0, 'haydensLads', true)
    expect(channelCreationValid1).toMatchObject({error: 'Channel name already exists'})
})
test('authUserId not in data', () => {
    clearV1();
    authRegisterV1('hayhay123@gmail.com','hayhay123', 'Hayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(2, 'haydensChannel', true)
    expect(channelCreationValid).toMatchObject({error: 'User is not valid'})
}) 
test('Channel name too short', () => {
    clearV1();
    authRegisterV1('hayhay123@gmail.com','hayhay123', 'Hayden', 'Jacobs')
    const channelCreationValid = channelsCreateV1(0, '', true)
    expect(channelCreationValid).toMatchObject({error: 'channel name is too short'})
})
