import { expect, jest } from '@jest/globals';
import MemberLogic from '../../../src/business-logic/member';
import listMembersController from '../../../src/controllers/club/list-members.controller';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/business-logic/member');

describe('Controller: Club: List members', () => {
  let resMock;
  const userId = 'some-user-id';
  const clubId = 'some-club-id';
  const members = [{ name: 'member1' }, { name: 'member2' }];

  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should list members', async () => {
    MemberLogic.listByClub.mockReturnValue(members);

    await listMembersController({ userId, params: { clubId } }, resMock);

    expect(resMock.send).toBeCalledWith({ members });
    expect(MemberLogic.listByClub).toHaveBeenCalledWith({ clubId, userId });
    expect(MemberLogic.listByClub).toHaveBeenCalledTimes(1);
  });

  it('Should return an error when MemberLogic.listByClub throws an error', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });
    MemberLogic.listByClub.mockRejectedValue(error);

    await listMembersController({ userId, params: { clubId } }, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({ error });
    expect(MemberLogic.listByClub).toHaveBeenCalledWith({ clubId, userId });
  });
});