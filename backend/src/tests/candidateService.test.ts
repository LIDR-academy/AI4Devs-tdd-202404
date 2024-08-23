import { addCandidate } from '../application/services/candidateService';
import { PrismaClient } from '@prisma/client';
import { Candidate } from '../domain/models/Candidate';

jest.mock('@prisma/client', () => {
  const mockCreate = jest.fn();
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: mockCreate,
      },
      $disconnect: jest.fn(),
    })),
    Prisma: {
      PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
        code: string;
        constructor(message: string, { code }: { code: string }) {
          super(message);
          this.code = code;
        }
      },
    PrismaClientInitializationError: class PrismaClientInitializationError extends Error {
      code: string;
      constructor(message: string, { code }: { code: string }) {
        super(message);
        this.code = code;
      }
    }
    }
  };
});

describe('candidateService', () => {
  let prisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    (prisma.candidate.create as jest.MockedFunction<typeof prisma.candidate.create>).mockClear();
  });

  it('should add a candidate successfully', async () => {
    const mockCandidate = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '612345678',
      address: '123 Main St',
    };

    (prisma.candidate.create as jest.MockedFunction<typeof prisma.candidate.create>).mockResolvedValue({ id: 1, ...mockCandidate });

    const result = await addCandidate(mockCandidate);

    expect(prisma.candidate.create).toHaveBeenCalledWith({
      data: mockCandidate,
    });
    expect(result).toEqual({ id: 1, ...mockCandidate });
  });

  it('should throw an error if email already exists', async () => {
    const mockCandidate = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing@example.com',
      phone: '623456789',
      address: '123 Main St',
    };

    const prismaError = new (jest.requireMock('@prisma/client').Prisma.PrismaClientKnownRequestError)(
      'Unique constraint failed on the fields: (`email`)',
      { code: 'P2002' }
    );

    (prisma.candidate.create as jest.MockedFunction<typeof prisma.candidate.create>).mockRejectedValue(prismaError);

    await expect(addCandidate(mockCandidate)).rejects.toThrow('The email already exists in the database');
  });
});