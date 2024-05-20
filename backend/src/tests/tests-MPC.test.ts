import { PrismaClient } from '@prisma/client';
import * as candidateService from '../application/services/candidateService';
import * as validator from '../application/validator';

interface Education {
  id: number;
  candidateId: number;
  institution: string;
  title: string;
  startDate: string;
  endDate: string;
}

interface WorkExperience {
  id: number;
  candidateId: number;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface Resume {
  id: number;
  candidateId: number;
  filePath: string;
  fileType: string;
}

interface ExtendedCandidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  educations: Education[];
  workExperiences: WorkExperience[];
  cv: Resume;
}

jest.mock('@prisma/client');
jest.mock('../application/validator');
jest.mock('../application/services/candidateService');

const prismaMock = PrismaClient as jest.MockedClass<typeof PrismaClient>;

describe('Candidate Creation Tests', () => {
    const mockCandidateData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        address: "123 Main St",
        educations: [{
            institution: "Test University",
            title: "BSc Computer Science",
            startDate: "2010-09-01",
            endDate: "2014-06-01"
        }],
        workExperiences: [{
            company: "Test Corp",
            position: "Software Engineer",
            description: "Developed software",
            startDate: "2015-07-01",
            endDate: "2020-08-01"
        }],
        cv: {
            filePath: "uploads/resume.pdf",
            fileType: "application/pdf"
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();

        Object.defineProperty(prismaMock.prototype, 'candidate', {
            value: {
                create: jest.fn().mockResolvedValue({
                    id: 1,
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    phone: null,
                    address: null
                }),
                update: jest.fn(),
                delete: jest.fn(),
                findUnique: jest.fn()
            },
            writable: true
        });

        Object.defineProperty(prismaMock.prototype, 'education', {
            value: {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                findUnique: jest.fn()
            },
            writable: true
        });

        Object.defineProperty(prismaMock.prototype, 'workExperience', {
            value: {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                findUnique: jest.fn()
            },
            writable: true
        });

        Object.defineProperty(prismaMock.prototype, 'resume', {
            value: {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                findUnique: jest.fn()
            },
            writable: true
        });
    });

    test('Should create a candidate sucessfully', async () => {
        jest.spyOn(candidateService, 'addCandidate').mockResolvedValue({
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: null,
            address: null
        });

        const result = await candidateService.addCandidate(mockCandidateData);
        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('firstName', 'John');
        expect(result).toHaveProperty('lastName', 'Doe');
        expect(result).toHaveProperty('email', 'john.doe@example.com');
    });

    test('Should handle duplicate email error', async () => {
        jest.spyOn(candidateService, 'addCandidate').mockRejectedValue(new Error('Unique constraint failed on the fields: (`email`)'));

        await expect(candidateService.addCandidate(mockCandidateData))
            .rejects
            .toThrow('Unique constraint failed on the fields: (`email`)');
    });

    test('Should ensure associated data is correctly linked and stored', async () => {
        jest.spyOn(candidateService, 'addCandidate').mockResolvedValue({
            ...mockCandidateData,
            id: 1,
            educations: [{...mockCandidateData.educations[0], candidateId: 1, id: 101}],
            workExperiences: [{...mockCandidateData.workExperiences[0], candidateId: 1, id: 201}],
            cv: {...mockCandidateData.cv, candidateId: 1, id: 301}
        } as ExtendedCandidate);

        const result = await candidateService.addCandidate(mockCandidateData) as ExtendedCandidate;

        expect(result).toHaveProperty('id', 1);
        expect(result.educations[0]).toHaveProperty('candidateId', 1);
        expect(result.workExperiences[0]).toHaveProperty('candidateId', 1);
        expect(result.cv).toHaveProperty('candidateId', 1);
    });

    test('Should fail when email is invalid', async () => {
      const candidateData = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        phone: "1234567890",
        address: "123 Main St"
      };
  
      jest.spyOn(candidateService, 'addCandidate').mockRejectedValue(new Error('Invalid email format'));
  
      await expect(candidateService.addCandidate(candidateData))
        .rejects
        .toThrow('Invalid email format');
    });
  
    test('Should fail when required fields are missing', async () => {
      const candidateData = {
        email: "john.doe@example.com"
      };
  
      jest.spyOn(candidateService, 'addCandidate').mockRejectedValue(new Error('Missing required fields'));
  
      await expect(candidateService.addCandidate(candidateData))
        .rejects
        .toThrow('Missing required fields');
    });
});

describe('Database Connection Error Handling Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        Object.defineProperty(prismaMock.prototype, 'candidate', {
            value: {
                create: jest.fn().mockImplementation(() => Promise.reject(new Error('Failed to connect to the database'))),
                update: jest.fn(),
                delete: jest.fn(),
                findUnique: jest.fn()
            },
            writable: true
        });
    });

    test('Should handle database connection error', async () => {
        const dummyData = {
            data: {
                firstName: "Dummy",
                lastName: "Data",
                email: "dummy@example.com"
            }
        };
        await expect(prismaMock.prototype.candidate.create(dummyData))
            .rejects
            .toThrow('Failed to connect to the database');
    });
});
