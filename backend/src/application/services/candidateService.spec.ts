import { addCandidate } from './candidateService';
import {
  Candidate,
  Education,
  WorkExperience,
  Resume,
} from '../../domain/models';
import { validateCandidateData } from '../validator';

jest.mock('../../domain/models/Candidate');
jest.mock('../../domain/models/Education');
jest.mock('../../domain/models/WorkExperience');
jest.mock('../../domain/models/Resume');
jest.mock('../validator');

const candidateData = {
  firstName: 'Juan',
  lastName: 'Perez',
  email: 'juan@example.com',
  phone: '1234567890',
  address: '123 Main St',
  educations: [
    {
      institution: 'Universidad',
      title: 'Ingeniería',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2024-01-01'),
    },
  ],
  workExperiences: [
    {
      company: 'Empresa X',
      position: 'Desarrollador',
      description: 'Desarrollo de software',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2023-01-01'),
    },
  ],
  cv: {
    filePath: 'path/to/cv.pdf',
    fileType: 'application/pdf',
  },
};

describe('addCandidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate and save a candidate successfully', async () => {
    const mockCandidate = { save: jest.fn().mockResolvedValue({ id: 1 }) };
    // @ts-ignore
    Candidate.mockImplementation((data) => ({
      ...mockCandidate,
      ...data,
      education: [],
      workExperience: [],
      resumes: [],
    }));
    // @ts-ignore
    validateCandidateData.mockImplementation(() => true);

    const result = await addCandidate(candidateData);

    expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
    expect(mockCandidate.save).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });

  it('should throw an error if validation fails', async () => {
    // @ts-ignore
    validateCandidateData.mockImplementation(() => {
      throw new Error('Validation failed');
    });

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Validation failed',
    );
  });
});
