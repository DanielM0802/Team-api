import { expect, jest } from '@jest/globals';
import listByClub from '../../../src/business-logic/subscription/list-by-club';
import SubscriptionModel from '../../../src/models/subscription/subscription.model';
import ClubLogic from '../../../src/business-logic/club';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/models/subscription/subscription.model');
jest.mock('../../../src/business-logic/club');

describe('Business logic: Subscription: List by Club', () => {
  const clubId = 'club123';
  const userId = 'user456';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should list subscriptions when the user is the club admin', async () => {
    ClubLogic.checkIfUserIsAdmin.mockResolvedValue();

    const subscriptions = [
      { name: 'subscription1', clubId },
      { name: 'subscription2', clubId },
    ];
    SubscriptionModel.find.mockResolvedValue(subscriptions);

    const result = await listByClub({ clubId, userId });

    expect(result).toEqual(subscriptions);
  });

  it('Should propagate an error when ClubLogic.checkIfUserIsAdmin throws an error', async () => {
    const error = new Error('User is not the admin of the club');
    ClubLogic.checkIfUserIsAdmin.mockRejectedValue(error);

    try {
      await listByClub({ clubId, userId });
      throw new Error('Expected an error, but no error was thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('User is not the admin of the club');
    }
  });

  it('Should propagate an HTTPError when ClubLogic.checkIfUserIsAdmin throws an HTTPError', async () => {
    const error = new HTTPError({ message: 'User is not the admin of the club', code: 403 });
    ClubLogic.checkIfUserIsAdmin.mockRejectedValue(error);

    try {
      await listByClub({ clubId, userId });
      throw new Error('Expected an HTTPError, but no HTTPError was thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(HTTPError);
      expect(error.statusCode).toEqual(403);
      expect(error.message).toEqual('User is not the admin of the club');
    }
  });

  it('Should propagate an error when SubscriptionModel.find throws an error', async () => {
    const error = new Error('Failed to find subscriptions');
    SubscriptionModel.find.mockRejectedValue(error);

    try {
      await listByClub({ clubId, userId });
      throw new Error('Expected an error, but no error was thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('Failed to find subscriptions');
    }
  });
});
