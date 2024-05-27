import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { PrismaClient } from '@prisma/client';

jest.mock('../application/validator');
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      education: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      resume: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      workExperience: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(async (callback: () => Promise<any>) => {
        return await callback();
      }),
    })),
  };
});

const prisma = new PrismaClient();

describe('Candidate Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const candidateInfo = {
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    educations: [{ degree: 'MBA', institution: 'Business School' }],
    workExperiences: [{ company: 'Tech Firm', role: 'Manager' }],
    cv: { fileName: 'cv.pdf', fileContent: '...' },
  };

  test.each([
    {
      description: 'successfully adds a candidate',
      candidateInfo,
      mockSave: jest.fn().mockResolvedValue({ id: 2 }),
      expected: { id: 2 },
      validateError: null,
      saveError: null,
      uniqueConstraintError: null,
    },
    {
      description: 'fails on general error',
      candidateInfo,
      mockSave: jest.fn().mockRejectedValue(new Error('Unexpected Error')),
      expected: 'Unexpected Error',
      validateError: null,
      saveError: 'Unexpected Error',
      uniqueConstraintError: null,
    },
    {
      description: 'validation error on adding candidate',
      candidateInfo: {},
      mockSave: jest.fn(),
      expected: 'Invalid Candidate Data',
      validateError: 'Invalid Candidate Data',
      saveError: null,
      uniqueConstraintError: null,
    },
    {
      description: 'unique email constraint violation',
      candidateInfo: {},
      mockSave: jest.fn().mockRejectedValue({ code: 'P2002' }),
      expected: 'The email already exists in the database',
      validateError: null,
      saveError: null,
      uniqueConstraintError: { code: 'P2002' },
    },
    {
      description: 'general error during save operation',
      candidateInfo: {},
      mockSave: jest.fn().mockRejectedValue(new Error('Save Operation Failed')),
      expected: 'Save Operation Failed',
      validateError: null,
      saveError: 'Save Operation Failed',
      uniqueConstraintError: null,
    },
    {
      description: 'successfully saves candidate education',
      candidateInfo: {
        ...candidateInfo,
        educationDetails: [{ degree: 'MBA', school: 'Business School' }],
      },
      mockSave: jest.fn().mockResolvedValue({ id: 2 }),
      expected: { id: 2 },
      validateError: null,
      saveError: null,
      uniqueConstraintError: null,
    },
    {
      description: 'successfully saves candidate work history',
      candidateInfo: {
        ...candidateInfo,
        workHistory: [{ employer: 'Tech Firm', title: 'Manager' }],
      },
      mockSave: jest.fn().mockResolvedValue({ id: 2 }),
      expected: { id: 2 },
      validateError: null,
      saveError: null,
      uniqueConstraintError: null,
    },
    {
      description: 'successfully saves candidate resume',
      candidateInfo: {
        ...candidateInfo,
        resumeDetails: { documentName: 'cv.pdf', content: '...' },
      },
      mockSave: jest.fn().mockResolvedValue({ id: 2 }),
      expected: { id: 2 },
      validateError: null,
      saveError: null,
      uniqueConstraintError: null,
    },
    {
      description: 'handles missing optional candidate details',
      candidateInfo: {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
      },
      mockSave: jest.fn().mockResolvedValue({ id: 2 }),
      expected: { id: 2 },
      validateError: null,
      saveError: null,
      uniqueConstraintError: null,
    },
  ])(
    '$description',
    async ({
      candidateInfo,
      mockSave,
      expected,
      validateError,
      saveError,
      uniqueConstraintError,
    }) => {
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        if (validateError) throw new Error(validateError);
      });

      (Candidate as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
        education: [],
        workExperience: [],
        resumes: [],
      }));

      if (uniqueConstraintError) {
        (prisma.$transaction as jest.Mock).mockImplementation(
          async (callback) => {
            throw uniqueConstraintError;
          },
        );
      } else if (saveError) {
        (prisma.$transaction as jest.Mock).mockImplementation(
          async (callback) => {
            throw new Error(saveError);
          },
        );
      } else {
        (prisma.$transaction as jest.Mock).mockImplementation(
          async (callback) => {
            return await callback();
          },
        );
      }

      if (validateError || saveError || uniqueConstraintError) {
        await expect(addCandidate(candidateInfo)).rejects.toThrow(expected);
      } else {
        const result = await addCandidate(candidateInfo);
        expect(validateCandidateData).toHaveBeenCalledWith(candidateInfo);
        expect(result).toEqual(expected);
        if ('educations' in candidateInfo) {
          expect(Education.prototype.save).toHaveBeenCalledWith(2);
        }
        if ('workExperiences' in candidateInfo) {
          expect(WorkExperience.prototype.save).toHaveBeenCalled();
        }
        if ('cv' in candidateInfo) {
          expect(Resume.prototype.save).toHaveBeenCalled();
        }
      }
    },
  );
});
