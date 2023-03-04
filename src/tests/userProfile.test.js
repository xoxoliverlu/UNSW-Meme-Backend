import { authRegisterV1 } from '../auth.js';
import { clearV1 } from '../other.js';
import { userProfileV1 } from '../users.js';

beforeEach(() => {
    clearV1();
});

describe('Failed tests.', () => {
    test('Invalid userId', () => {
        const registerAuth = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const authId = registerAuth.authUserId;
        const registerUser = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
        const userId = registerUser.authUserId;
        const userProfile = userProfileV1(authId, userId + 10);
        expect(userProfile).toStrictEqual({error: 'error'});
    });
    test('Invalid authId', () => {
        const registerAuth = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const authId = registerAuth.authUserId;
        const registerUser = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
        const userId = registerUser.authUserId;
        const userProfile = userProfileV1(authId + 10, userId);
        expect(userProfile).toStrictEqual({error: 'error'});
    });
});

test('Successful userProfileV1 Test. ', () => {
    const registerAuth = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = registerAuth.authUserId;
    const registerUser = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const userId = registerUser.authUserId;
    const userProfile = userProfileV1(authId, userId);
    expect(userProfile).toStrictEqual({
        uId: userId,
        nameFirst: 'Akanksha',
        nameLast: 'Sood',
        email: 'AkankshaS@gmail.com',
        handleStr: 'akankshasood',
    });
});