import {channelsListAllV1} from './channels';


test('Invalid users', () => {
    expect(channelsListAllV1(12389)).toStrictEqual({error: 'error'});
})