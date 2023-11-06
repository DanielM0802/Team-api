import { expect, jest } from '@jest/globals';
import ClubModel from '../../../src/models/club/club.model';
import get from '../../../src/business-logic/club/get';
import mongoose from 'mongoose';

jest.mock('../../../src/models/club/club.model');

describe('Business logic: Club: Get', () => {
  afterEach(async () => {
    jest.resetAllMocks();
    await ClubModel.deleteMany({});
  });

  it('Should return a club when it exists', async () => {
    const clubId = new mongoose.Types.ObjectId();
    const club = {
      _id: clubId,
      name: 'club-test',
      description: 'description',
      admin: new mongoose.Types.ObjectId(),
    };

    ClubModel.findById.mockResolvedValue(club);

    const result = await get(clubId);

    expect(ClubModel.findById).toHaveBeenCalledWith(clubId);
    expect(result).not.toBeNull();
    expect(result._id).toEqual(clubId);
    expect(result.name).toEqual(club.name);
    expect(result.description).toEqual(club.description);
    expect(result.admin).toEqual(club.admin);
  });

  it('Should return null when club does not exist', async () => {
    const clubId = new mongoose.Types.ObjectId();

    ClubModel.findById.mockResolvedValue(null);

    const result = await get(clubId);

    expect(ClubModel.findById).toHaveBeenCalledWith(clubId);
    expect(result).toBeNull();
  });
});