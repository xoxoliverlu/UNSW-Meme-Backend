import { requestChannelsCreate, requestAuthRegister, requestMessageSend, requestClear, requestUserStats, requestDmCreate, requestMessageSendDm } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Successful', () => {
  test('involvement Rate = 1', () => {
    const register = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
    const register2 = requestAuthRegister('oilverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
    const channel = requestChannelsCreate(register.token, 'channelNew', true);
    const {dmId} = requestDmCreate(register.token,[register2.token]);
    requestMessageSend(register.token, channel.channelId, 'cat');
    requestMessageSendDm(register2.token,dmId, "Hello");
    const {userStats} = requestUserStats(register.token)
    expect(userStats).toHaveProperty('channelsJoined');
    expect(userStats).toHaveProperty('dmsJoined');
    expect(userStats).toHaveProperty('messagesSent');
    expect(userStats).toHaveProperty('involvementRate');
    expect(userStats.involvementRate).toBe((1+1+1/1+1+2));
  });
});
