import { expect, jest } from '@jest/globals';
import SubscriptionLogic from '../../../src/business-logic/subscription';
import listSubscriptionsController from '../../../src/controllers/club/list-subscriptions.controller';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/business-logic/subscription');

describe('Controller: Club: List subscriptions', () => {
  let resMock;
  const userId = 'some-user-id';
  const clubId = 'some-club-id';
  const subscriptions = [
    { id: 'sub-1', name: 'Subscription 1' },
    { id: 'sub-2', name: 'Subscription 2' },
    { id: 'sub-3', name: 'Subscription 3' },
    { id: 'sub-4', name: 'Subscription 4' },
    { id: 'sub-5', name: 'Subscription 5' },
  ];

  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should list subscriptions', async () => {
    SubscriptionLogic.listByClub.mockReturnValue(subscriptions);

    await listSubscriptionsController({ userId, params: { clubId } }, resMock);

    expect(resMock.send).toBeCalledWith({ subscriptions });
    expect(SubscriptionLogic.listByClub).toHaveBeenCalledWith({ clubId, userId });
    expect(SubscriptionLogic.listByClub).toHaveBeenCalledTimes(1);
  });

  it('Should return an error when the logic fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });

    SubscriptionLogic.listByClub.mockRejectedValue(error);

    await listSubscriptionsController({ userId, params: { clubId } }, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({ error });
    expect(SubscriptionLogic.listByClub).toHaveBeenCalledWith({ clubId, userId });
    expect(SubscriptionLogic.listByClub).toHaveBeenCalledTimes(1);
  });
});