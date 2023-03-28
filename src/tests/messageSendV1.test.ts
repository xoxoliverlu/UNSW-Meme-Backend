import {requestChannelsCreate, requestAuthRegister, requestMessageSend, requestClear } from '../requests';

describe('Testing messagesendv1', () => {
    test('messagesendv1 success', () => {
      const register = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
      const channel = requestChannelsCreate(register.token, 'channelNew', true);
      const message = requestMessageSend(register.token, channel.channelId, 'cat');
      expect(message).toStrictEqual({ messageId: message.messageId });
    });
    test('more messages', () => {
      const register = requestAuthRegister('dimpi.garnepudin@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
      const channel = requestChannelsCreate(register.token, 'channelNew', true);
      requestMessageSend(register.token, channel.channelId, 'cat');
      const message2 = requestMessageSend(register.token, channel.channelId, 'hellobear');
      expect(message2).toStrictEqual({ messageId: message2.messageId });
    });
  
    test('channelId does not belong to a valid channel', () => {
      const register1 = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
      const message = requestMessageSend(register1.token, 5, 'dog');
      expect(message).toStrictEqual({ error: 'Invalid channelId' });
    });
  
    test('Length of mesage is less than 1 character', () => {
      const register = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
      const channel = requestChannelsCreate(register.token, 'channelNew', true);
      const message = requestMessageSend(register.token, channel.channelId, '');
      expect(message).toStrictEqual({ error: 'Message cannot be empty' });
    });
  
    test('Length of message is greater than 1000 characters', () => {
      const register = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
      const channel = requestChannelsCreate(register.token, 'channelNew', true);
      const message = requestMessageSend(register.token, channel.channelId, 'Gkl4h00MPXlVYAkWtMPA7PYe2R5bumQlOyS8DXaQUhOFxwS5DMkCko82aFBOk1kSfFURWFW3KiqvvrIq35N19Jz1KNqN2GYdbDS5iyiT5DQieCvkigQfSfwd6tbt8RX8qCr77YnEk9k4cmHqRod9wnlhLMHmcyRYIAVODHRH7Rluw9bjv42y50B7b3aecr6Bp0Ci8BJScYFFFa2BKwY4orTZJYqueGTt1OgoPAXsIxm4c5c2hT62Sk7aP1kkj4zPN68xIaNYdcMhMzanfwTy8rrBREA6EUPLfoevpFpdrOfZ9UsfME8x8naaNmrmdvqIenLSiNNCoM0SVjSA35s69K94bfMWBtmlSXhHebE7dOAkR2Z4kv6yiG63q2PjZvfmgGJG4YYnK0tkwWAvDW8l634YKJeQv19QtQH45gNWqbuFtYvyb7xxu7EJfNc5KdvGJxIyHTPRVQpwFnTzvHNXheaV9ZYWbctqQk7pGlJTMozY1W5Gq38lnpAZtT1VuOBxBU4wgJoeaInXN9X1OJL8KEkgdolghihCUpD3AYbz4wOwpMWaLl6ifx4HCo2wVyaIU74oAHg2rNmLYRd7ETcs6zYxmJEQf8elY6haEA9RSfpVQfugXF2CcUZ3RjA5K0tL62PJo5pfw8UspQ8sEkU7AkWOHu8K54Ce4Vfq1bRxKNq3nA1zGZ8eVtMRXy6qi6Hg8GDyJ6cfVMPmzn3g6yWZncQZ4APjzdLSD0M6EwPIQaViTK7XrveIRVFaIFP5XDOpKqEAu5QmIunydPVIAb3GqZ0fKz33REXhP6RaceH3QXBa6wg8hDUvbLIXQaJczMJBBW0PS3L4Cz1pH4KkJHFy9TIIrgk95rbaSpR5YXn6mfQzbfD7zU0ofCtzm5WhDBlvNfswXO3ga6B5FR2i3oHDO1G5Gkqjektwu1RY9fhLJRBAFpTNH4Y514dghup9fBPtU0FkrhIgd3pmDDFuOuzCmm9xWzd9fzVuzHv87aerAfYg0WM07eU2J0FHhG5Lq8HwwS88AHYYOmYuuTDqOX1Z3kANFMzaFg8jgtPhHFewf71KmE5yHJwX8xCTeyStds5bO0zzmqJz9pkq');
      expect(message).toStrictEqual({ error: 'Message is greater than 1000 characters' });
    });
  
    test('ChannelId is valid, but user is not part of the channel', () => {
      const register = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
      const register2 = requestAuthRegister('daniel.guo@gmail.com', 'danieliscool', 'Daniel', 'Guo');
      const channel = requestChannelsCreate(register.token, 'channelNew', true);
      const message = requestMessageSend(register2.token, channel.channelId, 'bird');
      expect(message).toStrictEqual({ error: 'User is not part of the channel' });
    });
  
    test('Token invalid', () => {
      const register = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
      const channel = requestChannelsCreate(register.token, 'channelNew', true);
      const message = requestMessageSend('AAAAAAAAAAA', channel.channelId, 'money');
      expect(message).toStrictEqual({ error: 'Token invalid' });
    });
  });
  
  