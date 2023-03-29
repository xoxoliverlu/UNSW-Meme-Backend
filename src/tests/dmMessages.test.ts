import {requestAuthRegister, requestDmMessages, requestDmCreate, requestClear, requestMessageSendDm } from '../requests';

beforeEach(() => {
  requestClear();
});



describe('/dm/messages/v1', () => {
    describe('errors', () => {
      test('dmId does not refer to a valid channel', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        requestDmCreate(register.token, [register2.authUserId]);
        const data = requestDmMessages(register.token, -1, 0);
        expect(data).toStrictEqual({ error: 'invalid dmId' });
      });
      test('dmId is valid and the authorised user is not a member of the DM', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const register3 = requestAuthRegister('madhu.shrestha@gmail.com', 'helloworld', 'madhu', 'shrestha');
        const dm = requestDmCreate(register.token, [register2.authUserId]);
        const data = requestDmMessages(register3.token, dm.dmId, 0);
        expect(data).toStrictEqual({ error: 'user is not a member of the DM' });
      });
      test('start is greater than the total number of messages in the channel', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const dm = requestDmCreate(register.token, [register2.authUserId]);
        const data = requestDmMessages(register.token, dm.dmId, 2);
        expect(data).toStrictEqual({ error: 'start parameter is greater than number of messages in DM' });
      });
      test('token is invalid', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpi', 'dimpi', 'garnepudi');
        const dm = requestDmCreate(register.token, [register2.authUserId]);
        const data = requestDmMessages(register.token + '1', dm.dmId, 0);
        expect(data).toStrictEqual({ error: 'token is invalid' });
      });
    });
    describe('success', () => {
      test('Zero messages', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const dm = requestDmCreate(register.token, [register2.authUserId]);
        const data = requestDmMessages(register.token, dm.dmId, 0);
        expect(data).toStrictEqual({
          messages: [],
          start: 0,
          end: -1
        });
      });
      test('less than 50 messages', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const dm = requestDmCreate(register.token, [register2.authUserId]);
        const message1 = requestMessageSendDm(register.token, dm.dmId, 'chocolate');
        const message2 = requestMessageSendDm(register.token, dm.dmId, 'icecream');
        const data = requestDmMessages(register.token, dm.dmId, 0);
        expect(data).toStrictEqual({
        messages: [],
        start: 0,
        end: -1,
        });
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
  
        expect(data).toStrictEqual({
          messages: [
            {
              messageId: message52.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message51.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message50.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message49.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message48.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message47.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message46.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message45.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message44.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message43.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message42.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message41.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message40.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message39.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message38.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message37.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message36.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message35.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message34.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message33.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message32.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message31.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message30.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message29.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message28.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message27.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message26.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message25.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message24.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message23.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message22.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message21.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message20.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message19.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message18.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message17.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message16.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message15.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message14.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message13.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message12.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message11.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message10.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message9.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message8.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message7.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message6.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message5.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message4.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            },
            {
              messageId: message3.messageId,
              uId: register.authUserId,
              message: 'hi',
              timeSent: expect.any(Number),
            }
          ],
          start: 0,
          end: 50
        });
      });
    });
  });
  
  