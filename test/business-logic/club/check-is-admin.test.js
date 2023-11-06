import { expect, jest } from '@jest/globals';
import ClubModel from '../../../src/models/club/club.model';
import checkIfTheUserIsTheClubAdmin from '../../../src/business-logic/club/check-is-admin';
import mongoose from 'mongoose';
import HTTPError from '../../../src/errors/http.error';

describe('Business logic: Club: Check is admin', () => {
  const club = {
    name: 'club-test',
    description: 'description',
  };

  const createObjectId = () => new mongoose.Types.ObjectId();

  afterEach(async () => {
    jest.resetAllMocks();
    await ClubModel.deleteMany({});
  });

  it('Should throw an error if the user is not the club admin', async () => {
    const adminId = createObjectId();
    const userId = createObjectId();

    const newClub = new ClubModel({ ...club, admin: adminId });
    await newClub.save();

    try {
      await checkIfTheUserIsTheClubAdmin({ clubId: newClub._id, userId });
      throw new Error('unexpected error');
    } catch (error) {
      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(HTTPError);
      expect(error.statusCode).toEqual(403);
      expect(error.message).toEqual('this users is not the admin of this club');
    }
  });

  it('Should not throw an error if the user is the club admin', async () => {
    const adminId = createObjectId();

    const newClub = new ClubModel({ ...club, admin: adminId });
    await newClub.save();

    expect(checkIfTheUserIsTheClubAdmin({ clubId: newClub._id, userId: adminId })).resolves.not.toThrow();
  });
});