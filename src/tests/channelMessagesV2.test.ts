import { requestAuthRegister, requestChannelsCreate, requestClear , requestChannelMessages, requestMessageSend } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});


describe('/channel/messages/v2', () => {
  describe('errors', () => {
    test('channelId does not refer to a valid channel', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const data = requestChannelMessages(register.token, -1, 0);
      expect(data).toStrictEqual({ error: 'channelId is not valid' });
    });

    test('start is greater than the total number of messages in the channel', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const data = requestChannelMessages(register.token, channel.channelId, 3);
      expect(data).toStrictEqual({ error: 'start parameter is greater than the total number of messages' });
    });

    test('the user is not a member of the channel', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpigarnepudi@gmail.com', 'dimpigarnepudi', 'dimpi', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const data = requestChannelMessages(register2.token, channel.channelId, 0);
      expect(data).toStrictEqual({ error: 'user is not a member in the channel' });
    });
    test('token is invalidl', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const data = requestChannelMessages(register.token + '1', channel.channelId, 0);
      expect(data).toStrictEqual({ error: 'token is invalid' });
    });
  });
  describe('success', () => {
    test('Zero messages', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const data = requestChannelMessages(register.token, channel.channelId, 0);
      expect(data).toStrictEqual({
        messages: [],
        start: 0,
        end: -1
      });
    });
    test('less than 50 messages', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const message1 = requestMessageSend(register.token, channel.channelId, 'chocolate');
      const message2 = requestMessageSend(register.token, channel.channelId, 'icecream');
      const data = requestChannelMessages(register.token, channel.channelId, 0);
      expect(data).toStrictEqual({
        messages: [
          {
            messageId: message2.messageId,
            uId: register.authUserId,
            message: 'icecream',
            timeSent: expect.any(Number),
          },
          {
            messageId: message1.messageId,
            uId: register.authUserId,
            message: 'chocolate',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: -1
      });
    });
    test('0 to 52 messages', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);

      requestMessageSend(register.token, channel.channelId, 'hi');
      requestMessageSend(register.token, channel.channelId, 'hi');
      const message3 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message4 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message5 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message6 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message7 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message8 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message9 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message10 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message11 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message12 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message13 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message14 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message15 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message16 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message17 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message18 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message19 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message20 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message21 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message22 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message23 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message24 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message25 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message26 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message27 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message28 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message29 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message30 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message31 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message32 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message33 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message34 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message35 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message36 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message37 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message38 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message39 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message40 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message41 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message42 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message43 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message44 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message45 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message46 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message47 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message48 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message49 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message50 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message51 = requestMessageSend(register.token, channel.channelId, 'hi');
      const message52 = requestMessageSend(register.token, channel.channelId, 'hi');

      const data = requestChannelMessages(register.token, channel.channelId, 0);
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
