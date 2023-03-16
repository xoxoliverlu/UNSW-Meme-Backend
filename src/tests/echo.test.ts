const { echo } = require('./echo');
const request = require('sync-request');

const OK = 200;

describe('HTTP tests using Jest', () => {
  test('Test successful echo', () => {
    const res = request(
      'GET',
            `${url}:${port}/echo`,
            {
              qs: {
                echo: 'Hello',
              }
            }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual('Hello');
  });
  test('Test invalid echo', () => {
    const res = request(
      'GET',
            `${url}:${port}/echo`,
            {
              qs: {
                echo: 'echo',
              }
            }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toStrictEqual({ error: 'error' });
  });
});
