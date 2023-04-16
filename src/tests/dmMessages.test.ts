import { requestAuthRegister, requestDmMessages, requestDmCreate, requestClear, requestMessageSendDm } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});
describe('/dm/messages/v1', () => {
  describe('errors', () => {
    test('dmId does not refer to a valid channel', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      requestDmCreate(register.token, [register2.authUserId]);
      const data = requestDmMessages(register.token, -1, 0);
      expect(data).toEqual(400);
    });
    test('dmId is valid and the authorised user is not a member of the DM', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const register3 = requestAuthRegister('madhu.shrestha@gmail.com', 'helloworld', 'madhu', 'shrestha');
      const dm = requestDmCreate(register.token, [register2.authUserId]);
      const data = requestDmMessages(register3.token, dm.dmId, 0);
      expect(data).toEqual(400);
    });
    test('start is greater than the total number of messages in the channel', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const dm = requestDmCreate(register.token, [register2.authUserId]);
      const data = requestDmMessages(register.token, dm.dmId, 2);
      expect(data).toEqual(400);
    });
    test('token is invalid', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpi', 'dimpi', 'garnepudi');
      const dm = requestDmCreate(register.token, [register2.authUserId]);
      const data = requestDmMessages(register.token + '1', dm.dmId, 0);
      expect(data).toEqual(400);
    });
  });
  describe('success', () => {
    test('Zero messages', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const dm = requestDmCreate(register.token, [register2.authUserId]);
      const data = requestDmMessages(register.token, dm.dmId, 0);
      expect(data).toStrictEqual(400);
    });
    test('less than 50 messages', () => {
      const register = requestAuthRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = requestAuthRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = requestDmCreate(register.token, [register2.authUserId]);
      const message1 = requestMessageSendDm(register.token, dm.dmId, 'chocolate');
      const message2 = requestMessageSendDm(register.token, dm.dmId, 'icecream');
      const data = requestDmMessages(register.token, dm.dmId, 0);
      expect(data).toStrictEqual(400);
    });
    test('0 to 52 messages', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const dm = requestDmCreate(register.token, [register2.authUserId]);

      requestMessageSendDm(register.token, dm.dmId, 'hi');
      requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message3 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message4 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message5 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message6 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message7 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message8 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message9 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message10 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message11 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message12 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message13 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message14 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message15 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message16 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message17 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message18 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message19 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message20 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message21 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message22 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message23 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message24 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message25 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message26 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message27 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message28 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message29 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message30 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message31 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message32 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message33 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message34 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message35 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message36 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message37 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message38 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message39 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message40 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message41 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message42 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message43 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message44 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message45 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message46 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message47 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message48 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message49 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message50 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message51 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const message52 = requestMessageSendDm(register.token, dm.dmId, 'hi');
      const data = requestDmMessages(register.token, dm.dmId, 0);

      expect(data).toStrictEqual(400);
    });
  });
  });
