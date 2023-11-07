import { expect, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import envs from '../../src/configs/environment';
import { generateToken, verifyToken } from '../../src/utils/jwt.util';

jest.mock('jsonwebtoken');

describe('Utils: JWT', () => {
  const data = { id: 'some-id' };
  const token = 'some-token';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('generateToken', () => {
    it('Should generate a token', () => {
      const expiresIn = '1h';
      const expectedToken = 'generated-token';

      jwt.sign.mockReturnValue(expectedToken);

      const result = generateToken({ data, expiresIn });

      expect(result).toBe(expectedToken);
      expect(jwt.sign).toHaveBeenCalledWith(data, envs.JWT.SECRET, { expiresIn });
    });

    it('Should generate a token with default expiration', () => {
      const expectedToken = 'generated-token';

      jwt.sign.mockReturnValue(expectedToken);

      const result = generateToken({ data });

      expect(result).toBe(expectedToken);
      expect(jwt.sign).toHaveBeenCalledWith(data, envs.JWT.SECRET, { expiresIn: envs.JWT.DEFAULT_EXPIRES });
    });
  });

  describe('verifyToken', () => {
    it('Should verify and decode the token', () => {
      const decoded = { data };
      jwt.verify.mockReturnValue(decoded);

      const result = verifyToken(token);

      expect(result).toBe(decoded);
      expect(jwt.verify).toHaveBeenCalledWith(token, envs.JWT.SECRET);
    });

    it('Should throw an error if the token is expired', () => {
      const error = new jwt.JsonWebTokenError('Token expired');
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(token)).toThrow(error);
      expect(jwt.verify).toHaveBeenCalledWith(token, envs.JWT.SECRET);
    });

    it('Should throw an error if the secret key is invalid', () => {
      const error = new jwt.JsonWebTokenError('Invalid signature');
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(token)).toThrow(error);
      expect(jwt.verify).toHaveBeenCalledWith(token, envs.JWT.SECRET);
    });
  });
});