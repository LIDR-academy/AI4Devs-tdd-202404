import { Education, prisma } from './Education';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        education: {
          create: jest.fn(),
          update: jest.fn(),
        },
      };
    }),
  };
});

describe('Education Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('save method', () => {
    it('should create a new education successfully', async () => {
      const educationData = {
        institution: 'MIT',
        title: 'BSc Computer Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };
      const education = new Education(educationData);

      // @ts-ignore
      prisma.education.create.mockResolvedValue({
        id: 1,
        ...educationData,
      });

      await expect(education.save()).resolves.toEqual({
        id: 1,
        ...educationData,
      });
      expect(prisma.education.create).toHaveBeenCalledWith({
        data: educationData,
      });
    });

    it('should update an existing education successfully', async () => {
      const educationData = {
        id: 1,
        institution: 'MIT',
        title: 'BSc Computer Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };
      const education = new Education(educationData);

      // @ts-ignore
      prisma.education.update.mockResolvedValue({
        ...educationData,
      });

      await expect(education.save()).resolves.toEqual({
        ...educationData,
      });
      expect(prisma.education.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          institution: educationData.institution,
          title: educationData.title,
          startDate: educationData.startDate,
          endDate: educationData.endDate,
        },
      });
    });
  });
});
