import {channelMessagesV1} from '../channel.js'
import {channelsCreateV1} from '../channels.js'
import {authRegisterV1} from '../auth.js'
import { clearV1 } from '../other.js';

beforeEach(() => {
  clearV1();
});


describe('Testing channelMessages1, errors', () =>{
  test('the channelId does not refer to a valid channel', () => {
    const registerAcc = authRegisterV1('jayjay123@gmail.com', 'jayjay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV1(registerAcc.authUserId, 'jaydensChannel', true);
    const channelMessagesInvalidId = channelMessagesV1(registerAcc.authUserId, channelCreationValid - 1, 0);
    expect(channelMessagesInvalidId).toMatchObject({error: 'error'});
  })

  test('start is greater than the total number of messages in the channel', () => {
    const registerAcc = authRegisterV1('jayjay123@gmail.com', 'jayjay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV1(registerAcc.authUserId, 'jaydensChannel', true);
    const channelMessagesInvalidStart = channelMessagesV1(registerAcc.authUserId, channelCreationValid.channelId, 50);
    expect(channelMessagesInvalidStart).toMatchObject({error: 'error'});
  })

  test('the user is not a member of the channel', () => {
    const registerAcc = authRegisterV1('jayjay123@gmail.com', 'jayjay123', 'Jayden', 'Jacobs');
    const registerAcc_2 = authRegisterV1('treehouse@gmail.com', 'qwerty', 'Tree', 'House');
    const channelCreationValid = channelsCreateV1(registerAcc.authUserId, 'jaydensChannel', true);
    const channelMessagesUserNotMember = channelMessagesV1(registerAcc_2.authUserId, channelCreationValid.channelId, 0);
    expect(channelMessagesUserNotMember).toMatchObject({error: 'error'});
  })

  test('authUserId is invalid', () => {
    const registerAcc = authRegisterV1('jayjay123@gmail.com', 'jayjay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV1(registerAcc.authUserId, 'jaydensChannel', true);
    const channelMessagesInvalidUser = channelMessagesV1(registerAcc.channelCreationValid - 1, channelCreationValid.channelId, 0);
    expect(channelMessagesInvalidUser).toMatchObject({error: 'error'});
  })

  test('function: channelMessagesV1 success', () => {
    const registerAcc = authRegisterV1('jayjay123@gmail.com', 'jayjay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV1(registerAcc.authUserId, 'jaydensChannel', true);
    const channelMessagesSuccess = channelMessagesV1(registerAcc.authUserId, channelCreationValid.channelId, 0);
    expect(channelMessagesSuccess).toStrictEqual({
      messages: [],
      start: 0,
      end: -1,
    });
    
  })
})