import { prismaMock } from './mocks/prismaMocks';
import { validateCandidateData } from '../application/validator';
import { addCandidate } from '../application/services/candidateService';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock)
}));


describe('validateCandidateData', () => {
  const validCandidateData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '612345678',
    address: '123 Main St',
    educations: [{
      institution: 'University',
      title: 'Bachelor',
      startDate: '2010-01-01',
      endDate: '2014-01-01'
    }],
    workExperiences: [{
      company: 'Company',
      position: 'Position',
      description: 'Description',
      startDate: '2015-01-01',
      endDate: '2020-01-01'
    }],
    cv: {
      filePath: 'resume.pdf',
      fileType: 'pdf'
    }
  };

  it('should not throw an error for valid candidate data', () => {
    expect(() => validateCandidateData(validCandidateData)).not.toThrow();
  });

  // Name validation cases
  it('should throw an error for invalid candidate data - empty name', () => {
    const invalidNameData = { ...validCandidateData, firstName: '' };
    expect(() => validateCandidateData(invalidNameData)).toThrow('Invalid name');
  });

  it('should throw an error for invalid candidate data - name too short', () => {
    const invalidNameData = { ...validCandidateData, firstName: 'a' };
    expect(() => validateCandidateData(invalidNameData)).toThrow('Invalid name');
  });

  it('should throw an error for invalid candidate data - name too long', () => {
    const invalidNameData = { ...validCandidateData, firstName: 'a'.repeat(101) };
    expect(() => validateCandidateData(invalidNameData)).toThrow('Invalid name');
  });

  it('should throw an error for invalid candidate data - name with numbers', () => {
    const invalidNameData = { ...validCandidateData, firstName: '123' };
    expect(() => validateCandidateData(invalidNameData)).toThrow('Invalid name');
  });

  // Email validation cases
  it('should throw an error for invalid candidate data - empty email', () => {
    const invalidEmailData = { ...validCandidateData, email: '' };
    expect(() => validateCandidateData(invalidEmailData)).toThrow('Invalid email');
  });

  it('should throw an error for invalid candidate data - malformed email', () => {
    const invalidEmailData = { ...validCandidateData, email: 'john.doe' };
    expect(() => validateCandidateData(invalidEmailData)).toThrow('Invalid email');
  });

  it('should throw an error for invalid candidate data - email missing domain', () => {
    const invalidEmailData = { ...validCandidateData, email: 'john.doe@' };
    expect(() => validateCandidateData(invalidEmailData)).toThrow('Invalid email');
  });

  // Phone validation cases
  it('should throw an error for invalid candidate data - phone with letters', () => {
    const invalidPhoneData = { ...validCandidateData, phone: 'abcdefghi' };
    expect(() => validateCandidateData(invalidPhoneData)).toThrow('Invalid phone');
  });

  it('should throw an error for invalid candidate data - phone with incorrect format', () => {
    const invalidPhoneData = { ...validCandidateData, phone: '123456789' };
    expect(() => validateCandidateData(invalidPhoneData)).toThrow('Invalid phone');
  });

  // Address validation cases
  it('should throw an error for invalid candidate data - address too long', () => {
    const invalidAddressData = { ...validCandidateData, address: 'a'.repeat(101) };
    expect(() => validateCandidateData(invalidAddressData)).toThrow('Invalid address');
  });

  // Education validation cases
  it('should throw an error for invalid candidate data - missing institution in education', () => {
    const invalidEducationData = { ...validCandidateData, educations: [{ ...validCandidateData.educations[0], institution: '' }] };
    expect(() => validateCandidateData(invalidEducationData)).toThrow('Invalid institution');
  });

  it('should throw an error for invalid candidate data - missing title in education', () => {
    const invalidEducationData = { ...validCandidateData, educations: [{ ...validCandidateData.educations[0], title: '' }] };
    expect(() => validateCandidateData(invalidEducationData)).toThrow('Invalid title');
  });

  it('should throw an error for invalid candidate data - invalid start date in education', () => {
    const invalidEducationData = { ...validCandidateData, educations: [{ ...validCandidateData.educations[0], startDate: '20101-02-30' }] };
    expect(() => validateCandidateData(invalidEducationData)).toThrow('Invalid date');
  });

  it('should throw an error for invalid candidate data - invalid end date in education', () => {
    const invalidEndDateData = { ...validCandidateData, educations: [{ ...validCandidateData.educations[0], endDate: 'invalid-date' }] };
    expect(() => validateCandidateData(invalidEndDateData)).toThrow('Invalid end date');
  });

  // Work experience validation cases
  it('should throw an error for invalid candidate data - missing company in work experience', () => {
    const invalidExperienceData = { ...validCandidateData, workExperiences: [{ ...validCandidateData.workExperiences[0], company: '' }] };
    expect(() => validateCandidateData(invalidExperienceData)).toThrow('Invalid company');
  });

  it('should throw an error for invalid candidate data - missing position in work experience', () => {
    const invalidExperienceData = { ...validCandidateData, workExperiences: [{ ...validCandidateData.workExperiences[0], position: '' }] };
    expect(() => validateCandidateData(invalidExperienceData)).toThrow('Invalid position');
  });

  it('should throw an error for invalid candidate data - invalid description length in work experience', () => {
    const invalidDescriptionData = { ...validCandidateData, workExperiences: [{ ...validCandidateData.workExperiences[0], description: 'a'.repeat(201) }] };
    expect(() => validateCandidateData(invalidDescriptionData)).toThrow('Invalid description');
  });

  it('should throw an error for invalid candidate data - invalid start date in work experience', () => {
    const invalidExperienceData = { ...validCandidateData, workExperiences: [{ ...validCandidateData.workExperiences[0], startDate: '20152-02-30' }] };
    expect(() => validateCandidateData(invalidExperienceData)).toThrow('Invalid date');
  });

  it('should throw an error for invalid candidate data - invalid end date in work experience', () => {
    const invalidExperienceData = { ...validCandidateData, workExperiences: [{ ...validCandidateData.workExperiences[0], endDate: 'invalid-date' }] };
    expect(() => validateCandidateData(invalidExperienceData)).toThrow('Invalid end date');
  });

  // CV validation cases
  it('should throw an error for invalid candidate data - invalid CV data', () => {
    const invalidCVData = { ...validCandidateData, cv: { filePath: 123, fileType: 456 } };
    expect(() => validateCandidateData(invalidCVData)).toThrow('Invalid CV data');
  });

  it('should throw an error for invalid candidate data - missing CV filePath', () => {
    const invalidCVData = { ...validCandidateData, cv: { filePath: '', fileType: 'pdf' } };
    expect(() => validateCandidateData(invalidCVData)).toThrow('Invalid CV data');
  });

  it('should throw an error for invalid candidate data - missing CV fileType', () => {
    const invalidCVData = { ...validCandidateData, cv: { filePath: '', fileType: '' } };
    expect(() => validateCandidateData(invalidCVData)).toThrow('Invalid CV data');
  });

  it('should throw an error for invalid candidate data - invalid CV fileType', () => {
    const invalidCVData = { ...validCandidateData, cv: { filePath: 'resume.pdfx', fileType: 'invalid' } };
    expect(() => validateCandidateData(invalidCVData)).toThrow('Invalid CV file type. Only pdf and docx are allowed.');
  });

  it('should not throw an error for valid candidate data with PDF CV', () => {
    const validCVData = { ...validCandidateData, cv: { filePath: 'resume.pdf', fileType: 'pdf' } };
    expect(() => validateCandidateData(validCVData)).not.toThrow();
  });

  it('should not throw an error for valid candidate data with DOCX CV', () => {
    const validCVData = { ...validCandidateData, cv: { filePath: 'resume.docx', fileType: 'docx' } };
    expect(() => validateCandidateData(validCVData)).not.toThrow();
  });
});

describe('addCandidate', () => {
  const validCandidateData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '612345678',
    address: '123 Main St',
    educations: [{
      institution: 'University',
      title: 'Bachelor',
      startDate: '2010-01-01',
      endDate: '2014-01-01'
    }],
    workExperiences: [{
      company: 'Company',
      position: 'Position',
      description: 'Description',
      startDate: '2015-01-01',
      endDate: '2020-01-01'
    }],
    cv: {
      filePath: 'resume.pdf',
      fileType: 'pdf'
    }
  };

  

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a candidate successfully', async () => {
    prismaMock.candidate.create.mockResolvedValue({ id: 1, ...validCandidateData });

    const result = await addCandidate(validCandidateData);
    expect(result).toHaveProperty('id', 1);
    expect(prismaMock.candidate.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      }),
    });
  });

  it('should throw an error for duplicate email', async () => {
    prismaMock.candidate.create.mockRejectedValue({ code: 'P2002' });

    await expect(addCandidate(validCandidateData)).rejects.toThrow('The email already exists in the database');
  });

  it('should throw an error for invalid candidate data', async () => {
    const invalidCandidateData = { ...validCandidateData, email: 'invalid-email' };

    await expect(addCandidate(invalidCandidateData)).rejects.toThrow('Invalid email');
  });
});

