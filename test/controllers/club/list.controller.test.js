import { expect, jest } from '@jest/globals';
import ClubLogic from '../../../src/business-logic/club';
import listController from '../../../src/controllers/club/list.controller';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/business-logic/club', () => ({
  list: jest.fn().mockReturnThis(),
}));

let resMock;

describe('Controller: Club: List clubs', () => {
  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should return a empty list', async () => {
    ClubLogic.list.mockReturnValue([]);

    await listController({}, resMock);

    expect(resMock.send).toBeCalledWith({ clubs: [] });
    expect(ClubLogic.list).toHaveBeenCalled();
  });

  it('Should return a list of clubs', async () => {
    const clubs = [{ name: 'club1', city: 'city1' }];
    ClubLogic.list.mockReturnValue(clubs);

    await listController({}, resMock);
    
    expect(resMock.send).toBeCalledWith({ clubs });
    expect(ClubLogic.list).toHaveBeenCalled();
  });

  it('Should throw an error when the logic fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });

    ClubLogic.list.mockRejectedValue(error);

    await listController({}, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({ error });
    expect(ClubLogic.list).toHaveBeenCalled();
    expect(ClubLogic.list).toHaveBeenCalledTimes(1);
  });
});