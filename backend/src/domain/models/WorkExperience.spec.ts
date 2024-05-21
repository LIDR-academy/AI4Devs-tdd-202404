import { WorkExperience, prisma } from './WorkExperience';

jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        workExperience: {
          create: jest.fn(),
          update: jest.fn(),
        },
      };
    }),
  };
});

describe('WorkExperience Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('save method', () => {
    it('should create a new work experience successfully', async () => {
      const mockWorkExperienceData = {
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Developing cool stuff',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-01-01'),
      };
      const workExperience = new WorkExperience(mockWorkExperienceData);

      // @ts-ignore
      prisma.workExperience.create.mockResolvedValue({
        id: 1,
        ...mockWorkExperienceData,
      });

      await expect(workExperience.save()).resolves.toEqual({
        id: 1,
        ...mockWorkExperienceData,
      });
    });

    it('should update an existing work experience successfully', async () => {
      const mockWorkExperienceData = {
        id: 1,
        company: 'Tech Corp',
        position: 'Senior Developer',
        description: 'Developing even cooler stuff',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2022-01-01'),
      };
      const workExperience = new WorkExperience(mockWorkExperienceData);

      // @ts-ignore
      prisma.workExperience.update.mockResolvedValue({
        ...mockWorkExperienceData,
      });

      await expect(workExperience.save()).resolves.toEqual({
        ...mockWorkExperienceData,
      });
    });

    it('should handle errors when updating non-existing work experience', async () => {
      const mockWorkExperienceData = {
        id: 999,
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Developing cool stuff',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-01-01'),
      };
      const workExperience = new WorkExperience(mockWorkExperienceData);

      // @ts-ignore
      prisma.workExperience.update.mockRejectedValue(
        new Error('Work experience not found'),
      );

      await expect(workExperience.save()).rejects.toThrow(
        'Work experience not found',
      );
    });
  });
});
