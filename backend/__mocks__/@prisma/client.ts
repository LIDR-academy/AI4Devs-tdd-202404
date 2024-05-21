// __mocks__/@prisma/client.js
const prismaMock = {
    candidate: {
        create: jest.fn().mockResolvedValue({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '623456789',
            address: '123 Main St, Anytown, AT 12345'
        }),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn()
    },
    resume: {
        create: jest.fn().mockResolvedValue({
            id: 1,
            candidateId: 1,
            filePath: 'path/to/resume.pdf',
            fileType: 'pdf',
            uploadDate: new Date()
        }),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn()
    },
    education: {
        create: jest.fn().mockResolvedValue({
            id: 1,
            candidateId: 1,
            institution: 'University A',
            title: 'Bachelor of Science',
            startDate: new Date('2010-09-01'),
            endDate: new Date('2014-06-30')
        }),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn()
    },
    workExperience: {
        create: jest.fn().mockResolvedValue({
            id: 1,
            candidateId: 1,
            company: 'Company A',
            position: 'Developer',
            description: 'Developed various applications',
            startDate: new Date('2018-01-01'),
            endDate: new Date('2020-12-31')
        }),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn()
    }
};

export const PrismaClient = jest.fn().mockImplementation(() => prismaMock);

