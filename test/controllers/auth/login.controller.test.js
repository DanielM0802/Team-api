import { expect, jest } from '@jest/globals';
import AuthLogic from '../../../src/business-logic/auth';
import login from '../../../src/controllers/auth/login.controller';
import authErrors from '../../../src/errors/auth.errors';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/business-logic/auth');

describe('Controller: Auth: Login', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should return an error when email is not defined', async () => {
    const req = {
      body: { password: 'password' },
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: new HTTPError({
        name: authErrors.login.validation.name,
        message: authErrors.login.validation.messages.email,
        code: 400,
      }),
    });
  });

  it('Should return an error when password is not defined', async () => {
    const req = {
      body: { email: 'test@example.com' },
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: new HTTPError({
        name: authErrors.login.validation.name,
        message: authErrors.login.validation.messages.password,
        code: 400,
      }),
    });
  });

  it('Should return a token when email and password are correct', async () => {
    const req = {
      body: { email: 'test@example.com', password: 'password' },
    };

    AuthLogic.login.mockResolvedValueOnce('token');

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ token: 'token' });
  });

  it('Should return an error when email is not valid', async () => {
    const req = {
      body: { email: 'test', password: 'password' },
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: new HTTPError({
        name: authErrors.login.validation.name,
        message: authErrors.login.validation.messages.email,
        code: 400,
      }),
    });
  });
});