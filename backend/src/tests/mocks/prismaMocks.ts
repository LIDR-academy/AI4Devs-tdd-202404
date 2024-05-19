import { PrismaClient } from '@prisma/client';

const getMockCandidateData = (overrides = {}) => ({...overrides});

const prismaMock = {
    candidate: {
        create: jest.fn().mockImplementation(async (data) => ({
            statusCode: 201, // Devuelve un código de estado HTTP 201 cuando se crea correctamente
            body: {
                id: Math.floor(Math.random() * 1000), // Simula la creación de un ID único
                ...data
            }
        })),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn()
    }
};

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => prismaMock)
}));

export { prismaMock, getMockCandidateData };
