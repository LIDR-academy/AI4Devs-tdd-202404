import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

const validCandidateData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '612345678',
  dateOfBirth: '1990-01-01',
  address: '123 Main St',
  educations: [
    { title: 'Bachelor', institution: 'University', startDate: '2020-01-01', endDate: '2024-01-01' },
  ],
  workExperiences: [
    { company: 'Company', position: 'Developer', startDate: '2020-01-01', endDate: '2022-01-01' },
  ],
  cv: { filePath: 'path/to/cv.pdf', fileType: 'pdf' },
};

describe('Validator', () => {
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
});

describe('Models', () => {
  it('should create a new Candidate instance', () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
      education: [{ degree: 'Bachelor', institution: 'University', startDate: '2020-01-01', endDate: '2024-01-01' }],
      workExperience: [{ company: 'Company', position: 'Developer', startDate: '2020-01-01', endDate: '2022-01-01' }],
      resumes: [{ filePath: 'path/to/resume.pdf', fileType: 'pdf' }],
    };
    const candidate = new Candidate(candidateData);
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
