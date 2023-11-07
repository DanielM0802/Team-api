import { jest } from '@jest/globals';
import ClubLogic from '../../src/business-logic/club';
import checkClubExists from '../../src/utils/check-club-exists.util';
import HTTPError from '../../src/errors/http.error';

jest.mock('../../src/business-logic/club');

describe('Utils: checkClubExists', () => {
  const clubId = 'some-id';
  const errorObject = new HTTPError({
    name: 'ClubNotFoundError',
    message: 'Club not found',
    code: 404,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should not throw an error when club exists', async () => {
    ClubLogic.get.mockResolvedValue({ id: clubId });

    await expect(checkClubExists({ clubId, errorObject })).resolves.not.toThrow();
    expect(ClubLogic.get).toHaveBeenCalledWith(clubId);
    expect(ClubLogic.get).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error when club does not exist', async () => {
    ClubLogic.get.mockResolvedValue(null);

    await expect(checkClubExists({ clubId, errorObject })).rejects.toThrow(errorObject);
    expect(ClubLogic.get).toHaveBeenCalledWith(clubId);
  });
});