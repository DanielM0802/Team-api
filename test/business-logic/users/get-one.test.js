import { expect, jest } from '@jest/globals';
import UserModel from '../../../src/models/user/user.model';
import getOne from '../../../src/business-logic/users/get-one';
import mongoose from 'mongoose';

jest.mock('../../../src/models/user/user.model');

describe('Business logic: User: Get one user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

    const user = { name: 'juan', email: 'juan@gmail.com', password: '12345', isAdmin: false };

  it('Should get the user', async () => {


    const getUserQuery = new mongoose.Query();
    getUserQuery.select = jest.fn().mockReturnThis();
    getUserQuery.populate = jest.fn().mockReturnThis();
    getUserQuery.exec = jest.fn().mockResolvedValue(user);

    UserModel.findOne.mockReturnValue(getUserQuery);

    const resp = await getOne({ query: { email: user.email }, select: ['name', 'email'], populate: ['isAdmin'] });

    expect(resp).not.toBeNull();
    expect(resp.name).toEqual(user.name);
    expect(resp.email).toEqual(user.email);
    expect(resp.isAdmin).toEqual(user.isAdmin);
  });

  it('Should get null if the user doesnt exist', async () => {
    UserModel.findOne.mockResolvedValue(null);
    const resp = await getOne({ query: { email: user.email } });
    expect(resp).toBeNull();
  });
});
