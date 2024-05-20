import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';

jest.mock('../domain/models/Candidate');

describe('addCandidate', () => {
  it('should validate and save candidate data', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      educations: [],
      workExperiences: [],
      cv: null,
    };

    (Candidate.prototype.save as jest.Mock).mockResolvedValue({ id: 1, ...candidateData });

    const result = await addCandidate(candidateData);

    expect(result).toEqual({ id: 1, ...candidateData });
    expect(Candidate.prototype.save).toHaveBeenCalled();
  });

  it('should throw an error if validation fails', async () => {
    const invalidCandidateData = { firstName: '', lastName: '', email: 'invalid-email' };

    await expect(addCandidate(invalidCandidateData)).rejects.toThrow('Error: Invalid name');
  });

  it('should throw an error if validation fails', async () => {
    const invalidCandidateData = { firstName: 'John', lastName: '', email: 'john.doe@example.com' };

    await expect(addCandidate(invalidCandidateData)).rejects.toThrow('Error: Invalid name');
  });

  it('should throw an error if validation fails', async () => {
    const invalidCandidateData = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: 'invalid-phone' };

    await expect(addCandidate(invalidCandidateData)).rejects.toThrow('Error: Invalid phone');
  });

});

