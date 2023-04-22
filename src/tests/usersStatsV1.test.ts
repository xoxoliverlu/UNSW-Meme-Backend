import { requestChannelsCreate, requestAuthRegister, requestMessageSend, requestClear, requestUserStats, requestDmCreate, requestMessageSendDm, requestUsersStats } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Successful', () => {
  test('Successful Case', () => {
    const register = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
    const register2 = requestAuthRegister('oilverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
    const {workspaceStats} = requestUsersStats(register2.token);
    expect(workspaceStats).toHaveProperty('channelsExist');
    expect(workspaceStats).toHaveProperty('dmsExist');
    expect(workspaceStats).toHaveProperty('messagesExist');
    expect(workspaceStats).toHaveProperty('utilizationRate');
    expect(workspaceStats.channelsExist.length).toBe(1);
    expect(workspaceStats.dmsExist.length).toBe(1);
    expect(workspaceStats.messagesExist.length).toBe(1);
    const channel = requestChannelsCreate(register.token, 'channelNew', true);
    const {dmId} = requestDmCreate(register.token,[register2.authUserId]);
    requestMessageSend(register.token, channel.channelId, 'cat');
    requestMessageSendDm(register2.token,dmId, "Hello");
    const {workspaceStats: workspaceStats1} = requestUsersStats(register.token);
    expect(workspaceStats1).toHaveProperty('channelsExist');
    expect(workspaceStats1).toHaveProperty('dmsExist');
    expect(workspaceStats1).toHaveProperty('messagesExist');
    expect(workspaceStats1).toHaveProperty('utilizationRate');
    expect(workspaceStats1.utilizationRate).toBe(1);
  });
});
