import MemberModel from '../../../src/models/member/member.model';
import checkIfUserIsAdmin from '../../../src/business-logic/club/check-is-admin';
import listByClub from '../../../src/business-logic/member/list-by-club';

jest.mock('../../../src/business-logic/club/check-is-admin');
jest.mock('../../../src/models/member/member.model');

describe('Business logic: Member: List by club', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return a list of members when the user is the club admin', async () => {
    const clubId = 'validClubId';
    const userId = 'validUserId';

    checkIfUserIsAdmin.mockResolvedValue();

    const sampleMembers = [
      { name: 'Member 1', clubId: clubId },
      { name: 'Member 2', clubId: clubId },
    ];

    MemberModel.find.mockResolvedValue(sampleMembers);

    const result = await listByClub({ clubId, userId });

    expect(checkIfUserIsAdmin).toHaveBeenCalledWith({ clubId, userId });
    expect(MemberModel.find).toHaveBeenCalledWith({ clubId });
    expect(result).toEqual(sampleMembers);
  });
});
