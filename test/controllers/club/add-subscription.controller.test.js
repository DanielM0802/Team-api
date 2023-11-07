import { expect, jest } from '@jest/globals';
import addSubscriptionController from '../../../src/controllers/club/add-subscription.controller';
import SubscriptionLogic from '../../../src/business-logic/subscription';
import { addValidation } from '../../../src/validations/subscription.validations';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/business-logic/subscription');
jest.mock('../../../src/validations/subscription.validations');

describe('Controller: Club: Add subscription', () => {
  let reqMock;
  let resMock;

  const subscription = {
    name: 'some-name',
    price: 10,
    description: 'some-description',
    clubId: 'some-club-id',
    startDate: new Date(),
    endDate: new Date(),
  };

  beforeEach(() => {
    reqMock = {
      body: {
        name: subscription.name,
        price: subscription.price,
        description: subscription.description,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
      params: {
        clubId: subscription.clubId,
      },
      userId: subscription.userId,
    };

    resMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should add a subscription', async () => {
    addValidation.validateAsync.mockResolvedValue();

    SubscriptionLogic.create.mockResolvedValue(subscription);

    await addSubscriptionController(reqMock, resMock);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(reqMock.body);
    expect(SubscriptionLogic.create).toHaveBeenCalledWith({
      ...reqMock.body,
      clubId: reqMock.params.clubId,
      userId: reqMock.userId,
    });
    expect(resMock.status).toHaveBeenCalledWith(201);
    expect(resMock.send).toHaveBeenCalledWith({ subscription });
  });

  it('Should throw an error when SubscriptionLogic.create fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });

    addValidation.validateAsync.mockResolvedValue();

    SubscriptionLogic.create.mockRejectedValue(error);

    await addSubscriptionController(reqMock, resMock);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(reqMock.body);
    expect(SubscriptionLogic.create).toHaveBeenCalledWith({
      ...reqMock.body,
      clubId: reqMock.params.clubId,
      userId: reqMock.userId,
    });
    expect(resMock.status).toHaveBeenCalledWith(400);
    expect(resMock.send).toHaveBeenCalledWith({ error });
  });
});