import { jest, expect } from '@jest/globals';
import authMiddleware from '../../src/middlewares/auth.middleware';
import HTTPError from '../../src/errors/http.error';
import { verifyToken } from '../../src/utils/jwt.util';
jest.mock('../../src/utils/jwt.util', () => ({
    verifyToken: jest.fn(),
  }));
  
  describe('Middleware: Auth: Auth token', () => {
    let req, res;
  
    const mockRequest = (headers) => ({
      headers,
    });
  
    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('Should return a 401 error when the token is missing from the authorization header', async () => {
        req = mockRequest({ Authorization: 'Bearer' });
      
        try {
          await authMiddleware(req, res);
        } catch (error) {
          expect(res.status).toBeCalledWith(401);
          expect(res.send).toBeCalledWith({
            error: expect.objectContaining({
              name: 'auhtorization_token_is_required',
              message: 'the authorization header is needed and the token',
              statusCode: 401,
            }),
          });
        }
      });


    it('Should return a 401 error when the token has expired', async () => {
    req = mockRequest({ Authorization: 'Bearer expired-token' });

    verifyToken.mockImplementation(() => {
        throw new Error('Token has expired');
    });

    try {
        await authMiddleware(req, res);
    } catch (error) {
        expect(res.status).toBeCalledWith(401);
        expect(res.send).toBeCalledWith({
        error: expect.objectContaining({
            name: 'token_expired',
            message: 'Token has expired',
            statusCode: 401,
        }),
        });
    }
    });  
      
  
    it('Should return a 401 error when the token is invalid', async () => {
      req = mockRequest({ Authorization: 'Bearer invalid-token' });
  
      verifyToken.mockImplementation(() => {
        throw new Error('invalid token');
      });
  
      try {
        await authMiddleware(req, res);
      } catch (error) {
        expect(res.status).toBeCalledWith(401);
        expect(res.send).toBeCalledWith({
          error: expect.objectContaining({
            name: 'invalid_token',
            message: 'invalid token',
            statusCode: 401,
          }),
        });
      }
    });
  


  });
  