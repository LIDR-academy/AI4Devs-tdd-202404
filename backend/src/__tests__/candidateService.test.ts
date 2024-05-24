import { addCandidate } from '../application/services/candidateService';
import { PrismaClient } from '@prisma/client';
import * as validator from '../application/validator';
import { WorkExperience } from '../domain/models/WorkExperience';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    candidate: {
      create: jest.fn(),
    },
    workExperience: {
      create: jest.fn(),
    },
    education: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});

describe('addCandidate', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should validate candidate data successfully before attempting to save', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '623456789',
      address: '123 Main St',
    };

    const mockCandidateCreate = jest
      .fn()
      .mockResolvedValue({ id: 1, ...candidateData });
    (prisma.candidate.create as jest.Mock) = mockCandidateCreate;

    await addCandidate(candidateData);

    expect(mockCandidateCreate).toHaveBeenCalled();
    expect(mockCandidateCreate).toHaveBeenCalledWith({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '623456789',
        address: '123 Main St',
      },
    });
  });

  it('should create a new candidate when no ID is provided', async () => {
    const candidateData = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      phone: '987654321',
      address: '456 Elm St',
    };

    const mockCandidateCreate = jest
      .fn()
      .mockResolvedValue({ id: 1, ...candidateData });
    (prisma.candidate.create as jest.Mock) = mockCandidateCreate;

    await addCandidate(candidateData);

    expect(mockCandidateCreate).toHaveBeenCalled();
    expect(mockCandidateCreate).toHaveBeenCalledWith({
      data: {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@example.com',
        phone: '987654321',
        address: '456 Elm St',
      },
    });
  });

  it('should update an existing candidate when ID is provided', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '623456789',
      address: '123 Main St',
    };
    const mockCandidateUpdate = jest
      .fn()
      .mockResolvedValue({ id: 1, ...candidateData });
    prisma.candidate.update = mockCandidateUpdate;

    await addCandidate({ id: 1, ...candidateData });

    expect(mockCandidateUpdate).toHaveBeenCalled();
    expect(mockCandidateUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '623456789',
        address: '123 Main St',
      },
    });
  });

  it('should save candidate work experiences when provided in the input', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '623456789',
      address: '123 Main St',
      workExperience: [
        {
          company: 'ABC Inc.',
          position: 'Software Engineer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
        {
          company: 'XYZ Corp.',
          position: 'Senior Developer',
          startDate: '2018-05-01',
          endDate: '2019-12-31',
        },
      ],
    };
    const mockCandidateCreate = jest
      .fn()
      .mockResolvedValue({ id: 1, ...candidateData });
    prisma.candidate.create = mockCandidateCreate;
    await addCandidate(candidateData);
    expect(mockCandidateCreate).toHaveBeenCalled();
    expect(mockCandidateCreate).toHaveBeenCalledWith({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '623456789',
        address: '123 Main St',
        workExperiences: {
          create: [
            {
              company: 'ABC Inc.',
              position: 'Software Engineer',
              startDate: '2020-01-01',
              endDate: '2021-01-01',
            },
            {
              company: 'XYZ Corp.',
              position: 'Senior Developer',
              startDate: '2018-05-01',
              endDate: '2019-12-31',
            },
          ],
        },
      },
    });
  });

  it('should save candidate education when provided in the input', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '623456789',
      address: '123 Main St',
      education: [
        {
          institution: 'University of Example',
          title: 'Bachelor of Science',
          startDate: '2015-09-01',
          endDate: '2019-06-30',
          candidateId: 1,
        },
        {
          institution: 'Institute of Technology',
          title: 'Master of Engineering',
          startDate: '2020-01-15',
          endDate: '2022-05-31',
          candidateId: 1,
        },
      ],
    };
    const mockCandidateCreate = jest
      .fn()
      .mockResolvedValue({ id: 1, ...candidateData });
    prisma.candidate.create = mockCandidateCreate;
    await addCandidate(candidateData);
    expect(mockCandidateCreate).toHaveBeenCalled();
    expect(mockCandidateCreate).toHaveBeenCalledWith({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '623456789',
        address: '123 Main St',
        educations: {
          create: [
            {
              institution: 'University of Example',
              title: 'Bachelor of Science',
              startDate: '2015-09-01',
              endDate: '2019-06-30',
            },
            {
              institution: 'Institute of Technology',
              title: 'Master of Engineering',
              startDate: '2020-01-15',
              endDate: '2022-05-31',
            },
          ],
        },
      },
    });
  });

  it('should save candidate resumes when provided in the input', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '623456789',
      address: '123 Main St',
      resumes: [
        {
          filePath: 'Software Engineer Resume',
          fileType: 'https://example.com/resume1.pdf',
          candidateId: 1,
          uploadDate: '2022-05-31',
        },
        {
          filePath: 'Data Scientist Resume',
          fileType: 'https://example.com/resume2.pdf',
          candidateId: 1,
          uploadDate: '2022-05-31',
        },
      ],
    };
    const mockCandidateCreate = jest
      .fn()
      .mockResolvedValue({ id: 1, ...candidateData });
    prisma.candidate.create = mockCandidateCreate;
    await addCandidate(candidateData);
    expect(mockCandidateCreate).toHaveBeenCalled();
    expect(mockCandidateCreate).toHaveBeenCalledWith({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '623456789',
        address: '123 Main St',
        resumes: {
          create: [
            {
              filePath: 'Software Engineer Resume',
              fileType: 'https://example.com/resume1.pdf',
            },
            {
              filePath: 'Data Scientist Resume',
              fileType: 'https://example.com/resume2.pdf',
            },
          ],
        },
      },
    });
  });

  it('should throw an error if candidate data validation fails', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '623456789',
      address: '123 Main St',
    };
    const errorMessage = 'Invalid email format';
    jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {
      throw new Error(errorMessage);
    });
    await expect(addCandidate(candidateData)).rejects.toThrow(errorMessage);
  });
});
