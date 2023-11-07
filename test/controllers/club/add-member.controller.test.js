import { expect, jest } from '@jest/globals';
import addMemberController from '../../../src/controllers/club/add-member.controller';
import MemberLogic from '../../../src/business-logic/member';
import { addValidation } from '../../../src/validations/member.validations';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/business-logic/member');
jest.mock('../../../src/validations/member.validations');

describe('Controller: Club: Add member', () => {
  let resMock;
  const req = {
    body: {
      name: 'member-test',
      email: 'member@test.com',
    },
    params: {
      clubId: 'some-club-id',
    },
    userId: 'some-user-id',
  };

  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should add a member to a club', async () => {
    MemberLogic.create.mockReturnValue(req.body);

    await addMemberController(req, resMock);

    expect(resMock.status).toBeCalledWith(201);
    expect(resMock.send).toBeCalledWith({ member: req.body });
    expect(MemberLogic.create).toHaveBeenCalledWith({ ...req.body, clubId: req.params.clubId, userId: req.userId });
  });

  it('Should throw an error when validation fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });
    addValidation.validateAsync.mockRejectedValue(error);

    await addMemberController(req, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({ error });
    expect(MemberLogic.create).not.toHaveBeenCalled();
  });

  it('Should throw an error when the logic fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });
    MemberLogic.create.mockRejectedValue(error);

    await addMemberController(req, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({ error });
    expect(MemberLogic.create).toHaveBeenCalledWith({ ...req.body, clubId: req.params.clubId, userId: req.userId });
  });
});