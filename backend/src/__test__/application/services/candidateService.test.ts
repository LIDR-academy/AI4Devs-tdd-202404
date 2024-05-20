import { Prisma } from '@prisma/client';
import { addCandidate } from '../../../application/services/candidateService';
import { Candidate } from '../../../domain/models/Candidate';

jest.mock('../../../domain/models/Candidate', () => {
  const originalModule = jest.requireActual('../../../domain/models/Candidate');
  return {
    ...originalModule,
    Candidate: jest.fn()
  };
});

describe('addCandidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if required fields are missing', async () => {
    const MockedCandidate = Candidate as jest.MockedClass<typeof Candidate>;
    MockedCandidate.mockImplementation(() => new Candidate({
      save: jest.fn().mockImplementation(() => {
        throw new Error('Required fields are missing');
      })
    }));

    const candidateData = {
      firstName: 'John',
      email: 'john.doe@example.com', // lastName is missing
    };

    await expect(addCandidate(candidateData)).rejects.toThrow('Required fields are missing');
  });

  it('should handle unique email constraint violation', async () => {
    const MockedCandidate = Candidate as jest.MockedClass<typeof Candidate>;
    MockedCandidate.mockImplementation(() => new Candidate({
      save: jest.fn().mockImplementation(() => {
        throw new Prisma.PrismaClientKnownRequestError(
          'A unique constraint would be violated on Candidate. Details: Unique constraint failed on the fields: (`email`)',
          {
            code : 'P2002',
            clientVersion: '3.4.0'
          }
        );
      })
    }));

    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing.email@example.com',
    };

    await expect(addCandidate(candidateData)).rejects.toThrow('A unique constraint would be violated on Candidate. Details: Unique constraint failed on the fields: (`email`)');
  });

  it('should save candidate with multiple education records successfully', async () => {
    const MockedCandidate = Candidate as jest.MockedClass<typeof Candidate>;
    MockedCandidate.mockImplementation(() => new Candidate({
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        education: [
          { institution: 'University A', title: 'Bachelor', startDate: '2010-01-01', endDate: '2014-01-01' },
          { institution: 'University B', title: 'Master', startDate: '2015-01-01', endDate: '2017-01-01' }
        ]
      })
    }));

    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      education: [
        { institution: 'University A', title: 'Bachelor', startDate: '2010-01-01', endDate: '2014-01-01' },
        { institution: 'University B', title: 'Master', startDate: '2015-01-01', endDate: '2017-01-01' }
      ]
    };

    const result = await addCandidate(candidateData);
    expect(result.education.length).toBe(2);
  });

  // Similar tests can be written for work experiences, resumes, update scenarios, connection errors, etc.
});

