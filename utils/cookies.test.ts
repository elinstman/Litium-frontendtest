import { setCookieFromResponse } from './cookies';
const cookiesMock = jest.fn();
jest.mock('next/headers', () => ({
  cookies: () => ({
    set: cookiesMock,
  }),
}));
describe('setCookieFromResponse', () => {
  let mockResponse: any;

  beforeEach(() => {
    mockResponse = {
      __setCookie: 'cookie1=value1, cookie2=value2',
    };
  });

  afterEach(() => {
    cookiesMock.mockClear();
  });

  test('should set cookies correctly from response', async () => {
    await setCookieFromResponse(mockResponse);

    expect(cookiesMock).toHaveBeenCalledTimes(2);
    expect(cookiesMock).toHaveBeenCalledWith('cookie1', 'value1', {
      name: 'cookie1',
      value: 'value1',
    });
    expect(cookiesMock).toHaveBeenCalledWith('cookie2', 'value2', {
      name: 'cookie2',
      value: 'value2',
    });
  });

  test('should not set cookies when response does not have __setCookie', async () => {
    delete mockResponse.__setCookie;
    await setCookieFromResponse(mockResponse);
    expect(cookiesMock).not.toHaveBeenCalled();
  });
});
