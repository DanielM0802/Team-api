import ClubModel from '../../../src/models/club/club.model';
import list from '../../../src/business-logic/club/list';

jest.mock('../../../src/models/club/club.model');

describe('Business logic: Club: List', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return a list of clubs with admin and manager user IDs populated', async () => {
    const sampleClubs = [
      {
        name: 'Club 1',
        admin: { userId: 'adminID1' },
        managers: [{ userId: 'managerID1' }, { userId: 'managerID2' }],
      },
      {
        name: 'Club 2',
        admin: { userId: 'adminID2' },
        managers: [{ userId: 'managerID3' }],
      },
    ];

    const mockFind = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(sampleClubs) });
    ClubModel.find = mockFind;

    const result = await list();

    expect(mockFind).toHaveBeenCalledWith({});
    expect(mockFind().populate).toHaveBeenCalledWith('admin managers.userId');
    expect(result).toEqual(sampleClubs);
    console.log(result)
  });

  it('Should handle an empty list of clubs', async () => {
    const emptyClubs = [];

    const mockFind = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(emptyClubs) });
    ClubModel.find = mockFind;

    const result = await list();

    expect(mockFind).toHaveBeenCalledWith({});
    expect(mockFind().populate).toHaveBeenCalledWith('admin managers.userId');
    expect(result).toEqual(emptyClubs);
  });
});
