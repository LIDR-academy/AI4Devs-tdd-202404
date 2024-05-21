import { Candidate, prisma } from './Candidate';
import { Education } from './Education';
import { WorkExperience } from './WorkExperience';
import { Resume } from './Resume';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        candidate: {
          create: jest.fn(),
          update: jest.fn(),
          findUnique: jest.fn(),
        },
      };
    }),
  };
});

jest.mock('./Education');
jest.mock('./WorkExperience');
jest.mock('./Resume');

describe('Candidate Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('save method', () => {
    it('should create a new candidate successfully', async () => {
      // @ts-ignore
      prisma.candidate.create.mockResolvedValue({
        id: 1,
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
      });
      const candidate = new Candidate({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
      });

      await expect(candidate.save()).resolves.toEqual({
        id: 1,
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
      });
    });

    it('should update an existing candidate successfully', async () => {
      // @ts-ignore
      prisma.candidate.update.mockResolvedValue({
        id: 1,
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
      });
      const candidate = new Candidate({
        id: 1,
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
      });
      await expect(candidate.save()).resolves.toEqual({
        id: 1,
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
      });
    });

    it('should throw an error if the candidate does not exist', async () => {
      // @ts-ignore
      prisma.candidate.update.mockRejectedValue(
        new Error('Candidate not found'),
      );
      const candidate = new Candidate({
        id: 999,
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
      });
      await expect(candidate.save()).rejects.toThrow('Candidate not found');
    });
  });

  describe('findOne method', () => {
    it('should return a candidate if found', async () => {
      // @ts-ignore
      prisma.candidate.findUnique.mockResolvedValue({
        id: 1,
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
      });
      await expect(Candidate.findOne(1)).resolves.toMatchObject({
        id: 1,
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
      });
    });

    it('should return null if candidate is not found', async () => {
      // @ts-ignore
      prisma.candidate.findUnique.mockResolvedValue(null);
      await expect(Candidate.findOne(999)).resolves.toBeNull();
    });
  });
});
