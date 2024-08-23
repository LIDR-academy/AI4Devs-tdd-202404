import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';
import * as candidateService from '../application/services/candidateService';

jest.mock('../application/services/candidateService');

describe('candidateController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {};
    mockResponse = {
      status: mockStatus,
    };
  });

  it('should add a candidate successfully', async () => {
    const mockCandidate = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '634567890',
      address: '123 Main St',
    };

    mockRequest.body = mockCandidate;

    (candidateService.addCandidate as jest.Mock).mockResolvedValue({ id: 1, ...mockCandidate });

    await addCandidateController(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Candidate added successfully',
      data: { id: 1, ...mockCandidate },
    });
  });

  it('should handle errors when adding a candidate', async () => {
    const mockCandidate = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing@example.com',
      phone: '645678901',
      address: '123 Main St',
    };

    mockRequest.body = mockCandidate;

    (candidateService.addCandidate as jest.Mock).mockRejectedValue(new Error('The email already exists in the database'));

    await addCandidateController(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Error adding candidate',
      error: 'The email already exists in the database',
    });
  });
});