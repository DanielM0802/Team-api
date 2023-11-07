import { expect, jest } from '@jest/globals';
import createSubscription from '../../../src/business-logic/subscription/create';
import SubscriptionModel from '../../../src/models/subscription/subscription.model';

import ClubLogic from '../../../src/business-logic/club';
import checkClubExists from '../../../src/utils/check-club-exists.util'; 
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/models/subscription/subscription.model');
jest.mock('../../../src/business-logic/club');
jest.mock('../../../src/utils/check-club-exists.util'); 

describe('Business logic: Subscription: Create', () => {
  const subscription = {
    name: 'subscription-test',
    price: '50',
    clubId: 'club123',
    userId: 'user456',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should create a subscription', async () => {
    checkClubExists.mockResolvedValue();
    ClubLogic.checkIfUserIsAdmin.mockResolvedValue();

    const subscription = { ...subscription, _id: 'subscription789' };
    SubscriptionModel.create.mockResolvedValue(subscription);
    const result = await createSubscription(subscription);

    expect(result).toEqual(subscription);
  });

  
  it('Should propagate an HTTPError when checkClubExists throws an error', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 404 });
    checkClubExists.mockRejectedValue(error);

    try {
      await createSubscription(subscription);
      throw new Error('Expected an error, but no error was thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(HTTPError);
      expect(error.statusCode).toEqual(404);
    }
  });


  it('Should propagate an error when SubscriptionModel.create throws an error', async () => {

    const error = new Error('Failed to create a subscription');
    SubscriptionModel.create.mockRejectedValue(error);

    try {
      await createSubscription(subscription);
      throw new Error('Expected an error, but no error was thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('Failed to create a subscription');
    }
  });
});
