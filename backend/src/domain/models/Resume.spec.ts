import { Resume, prisma } from './Resume';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        resume: {
          create: jest.fn(),
        },
      };
    }),
  };
});

describe('Resume Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('save method', () => {
    it('should create a new resume successfully', async () => {
      const resumeData = {
        candidateId: 1,
        filePath: 'path/to/resume.pdf',
        fileType: 'pdf',
        uploadDate: new Date(),
      };
      const createdResume = {
        ...resumeData,
        id: 1,
      };

      // @ts-ignore
      prisma.resume.create.mockResolvedValue(createdResume);
      const resume = new Resume(resumeData);

      await expect(resume.save()).resolves.toEqual(new Resume(createdResume));
    });

    it('should throw an error when trying to update an existing resume', async () => {
      const resumeData = {
        id: 1,
        candidateId: 1,
        filePath: 'path/to/resume.pdf',
        fileType: 'pdf',
        uploadDate: new Date(),
      };
      const resume = new Resume(resumeData);

      await expect(resume.save()).rejects.toThrow(
        'No se permite la actualización de un currículum existente.',
      );
    });

    it('should handle database connection errors on create', async () => {
      const resumeData = {
        candidateId: 1,
        filePath: 'path/to/resume.pdf',
        fileType: 'pdf',
        uploadDate: new Date(),
      };

      // @ts-ignore
      prisma.resume.create.mockRejectedValue(
        new Error('Database connection error'),
      );
      const resume = new Resume(resumeData);

      await expect(resume.save()).rejects.toThrow('Database connection error');
    });
  });
});
