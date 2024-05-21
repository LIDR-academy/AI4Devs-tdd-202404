import { prismaMock } from '../mocks/databaseModuleMock';
import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { mockCandidateData as validCandidateData } from '../mocks/mockData';
import { addCandidate } from '../application/services/candidateService'

// Mock de la función que interactúa con la base de datos
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock)
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('validateCandidateData', () => {
  it('should return true for valid candidate data', () => {
    expect(validateCandidateData(validCandidateData)).toBe(true);
  });

  it('should return false for invalid candidate data (name)', () => {
    const invalidCandidateData = { ...validCandidateData, firstName: 'J' };
    expect(validateCandidateData(invalidCandidateData)).toBe(false);
  });

  it('should return false for invalid candidate data (email)', () => {
    const invalidCandidateData = { ...validCandidateData, email: 'invalid_email' };
    expect(validateCandidateData(invalidCandidateData)).toBe(false);
  });

  it('should return false for invalid candidate data (phone)', () => {
    const invalidCandidateData = { ...validCandidateData, phone: '123456789' };
    expect(validateCandidateData(invalidCandidateData)).toBe(false);
  });

  it('should return false for invalid candidate data (address)', () => {
    const invalidCandidateData = { ...validCandidateData, address: "" };
    expect(validateCandidateData(invalidCandidateData)).toBe(false);
  });

  it('should return false for invalid candidate data (education)', () => {
    const invalidCandidateData = { ...validCandidateData, educations: [{ degree: 'Bachelor', startDate: '2020-01-01' }] };
    expect(validateCandidateData(invalidCandidateData)).toBe(false);
  });

  it('should return false for invalid candidate data (experience)', () => {
    const invalidCandidateData = { ...validCandidateData, workExperiences: [{ position: 'Developer', startDate: '2020-01-01' }] };
    expect(validateCandidateData(invalidCandidateData)).toBe(false);
  });

  it('should return false for invalid candidate data (cv)', () => {
    const invalidCandidateData = { ...validCandidateData, cv: 'invalid_cv' };
    expect(validateCandidateData(invalidCandidateData)).toBe(false);
  });
});


describe('addCandidate', () => {
  it('should add a new candidate with education and work experience', async () => {
    // Mock the behavior of Prisma methods
    prismaMock.candidate.create.mockResolvedValueOnce({ id: 1 });
    prismaMock.education.create.mockResolvedValueOnce({ id: 1 });
    prismaMock.workExperience.create.mockResolvedValueOnce({ id: 1 });
    prismaMock.resume.create.mockResolvedValueOnce({ id: 1 });

    // Call addCandidate function
    const addedCandidate = await addCandidate(validCandidateData);

    // Assertions
    expect(addedCandidate).toBeDefined();
    expect(addedCandidate.id).toBe(1);
    // Add more assertions as needed
  });

  it('should throw an error if the email already exists in the database', async () => {
    // Mock candidate data with existing email
    const candidateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'john@example.com', // Existing email
      phone: '987654321',
      address: '456 Elm St',
      educations: [],
      workExperiences: [],
      cv: { filePath: 'path/to/cv.pdf', fileType: 'pdf' }
    };

    // Mock the behavior of Prisma methods to simulate unique constraint error 'P2002'
    prismaMock.candidate.create.mockRejectedValueOnce({ code: 'P2002' });

    // Assertions for error handling
    await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');

    // Verify that the Prisma mock methods were called as expected
    expect(prismaMock.candidate.create).toHaveBeenCalledWith(candidateData);
  });


  describe('Models', () => {
    it('should create a new Candidate instance', () => {
      const candidate = new Candidate(validCandidateData);
      expect(candidate).toBeInstanceOf(Candidate);
    });

    it('should create a new Education instance', () => {
      const educationData = { degree: 'Bachelor', institution: 'University', startDate: '2020-01-01', endDate: '2024-01-01' };
      const education = new Education(educationData);
      expect(education).toBeInstanceOf(Education);
    });

    it('should create a new WorkExperience instance', () => {
      const experienceData = { company: 'Company', position: 'Developer', startDate: '2020-01-01', endDate: '2022-01-01' };
      const experience = new WorkExperience(experienceData);
      expect(experience).toBeInstanceOf(WorkExperience);
    });

    it('should create a new Resume instance', () => {
      const resumeData = { filePath: 'path/to/resume.pdf', fileType: 'pdf' };
      const resume = new Resume(resumeData);
      expect(resume).toBeInstanceOf(Resume);
    });
  });
});
