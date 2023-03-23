import { requestUserProfile, requestAuthRegister, requestAuthLogin, requestAuthLogout, requestClear } from '../requests';

beforeEach(() => {
	requestClear();
});

afterAll(() => {
	requestClear();
});

describe('Valid inputs for auth logoutV1', () => {
	test('Successful logout - one session', () => {
		const register = requestAuthRegister('AkankshaS@gmail.com', 'password0923', 'Akanksha', 'Sood');
		const logout1 = requestAuthLogout(register.token);
		expect(logout1).toStrictEqual({});
		expect(requestUserProfile(register.token, register.authUserId)).toEqual({error: expect.any(String)});
	});

	test('Successful logout - multiple sessions', () => {
		const register = requestAuthRegister('AkankshaS@gmail.com', 'password0923', 'Akanksha', 'Sood');
		const login1 = requestAuthLogin('akankshas@gmail.com', 'password0923');
		const login2 = requestAuthLogin('akankshas@gmail.com', 'password0923');
		const logout1 = requestAuthLogout(login1.token);
		const logout2 = requestAuthLogout(register.token);
		expect(logout1).toStrictEqual({});
		expect(logout2).toStrictEqual({});
		expect(requestUserProfile(register.token, register.authUserId)).toEqual({error: expect.any(String)});
		expect(requestUserProfile(login1.token, register.authUserId)).toEqual({error: expect.any(String)});
		const userDetail = {
			user: {
				uId: register.uId,
				email: 'akankshas@gmail.com',
				nameFirst: 'Akanksha',
				nameLast: 'Sood',
				handleStr: 'akankshasood'
			}
		}
		expect(requestUserProfile(login2.token, register.authUserId).toStrictEqual(userDetail));
	});
});

describe('Invalid inputs for authLogoutV1', () => {
	test('Invalid token', () => {
		const register = requestAuthRegister('AkankshaS@gmail.com', 'password0923', 'Akanksha', 'Sood');
		const logout = requestAuthLogout('InvalidToken');
		expect(logout).toStrictEqual({error: expect.any(String)});
	});
});