import { PrismaClient } from '@prisma/client';

export const prismaMock = {
    candidate: {
        create: jest.fn().mockImplementation(() => {}),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn()
    },
    education: {
        create: jest.fn().mockImplementation(() => {}),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn()
    },
    workExperience: {
        create: jest.fn().mockImplementation(() => {}),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn()
    },
    resume: {
        create: jest.fn().mockImplementation(() => {}),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn()
    }
};
