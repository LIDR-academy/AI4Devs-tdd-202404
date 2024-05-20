import { addCandidate } from '../application/services/candidateService';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        candidate: {
            create: jest.fn().mockResolvedValue({
                id: 1, // Mocked ID value
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                // Include other properties as needed based on your schema
            }),
        },
    })),
}));

describe('addCandidate function', () => {
    test('should insert a candidate into the database', async () => {
        // Mock candidate data
        const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            // Add other required fields as needed
        };

        // Call addCandidate function with the mock data
        const result = await addCandidate(candidateData);

        // Assert the result as needed
        expect(result).toBeDefined();
        expect(result.id).toBe(1); // Check if the id is as expected
        // Add more assertions based on the expected behavior
    });

    test('should handle errors during candidate insertion', async () => {
        // Mock candidate data with missing required fields to trigger an error
        const candidateData = {
            // Missing required fields
        };

        // Call addCandidate function with the incomplete data
        try {
            await addCandidate(candidateData);
        } catch (error) {
            // Assert the error handling logic
            expect(error).toBeDefined();
            // Add more assertions based on the expected error scenarios
        }
    });
});

