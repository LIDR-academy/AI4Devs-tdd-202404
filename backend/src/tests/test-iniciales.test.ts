import { validateCandidateData } from "../application/validator";
import { addCandidate } from "../application/services/candidateService";


// CANDIDATE DATA VALIDATION
describe('Candidate Data Validation', () => {
 
    const validCandidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
    };

    it('should not perform any validation checks when an id is provided', () => {
        const candidateData = { ...validCandidateData, id: 1 };
        expect(() => validateCandidateData(candidateData)).not.toThrow();
    });

    it('should validate a correct name', () => {
        // Use the valid mock data directly
        expect(() => validateCandidateData(validCandidateData)).not.toThrow();
    });

    it('should throw an error for an empty name', () => {
        const candidateData = { ...validCandidateData, firstName: '', lastName: '' };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
    });

    it('should throw an error for a name with invalid characters', () => {
        const candidateData = { ...validCandidateData, firstName: 'John123', lastName: 'Doe@' };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
    });

    it('should throw an error for a name that is too short', () => {
        const candidateData = { ...validCandidateData, firstName: 'J', lastName: 'D' };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
    });

    it('should throw an error for a name that is too long', () => {
        const candidateData = { ...validCandidateData, firstName: 'J'.repeat(101), lastName: 'D'.repeat(101) };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
    });

    it('should validate a correct email', () => {
        // Use the valid mock data directly
        expect(() => validateCandidateData(validCandidateData)).not.toThrow();
    });

    it('should throw an error for an empty email', () => {
        const candidateData = { ...validCandidateData, email: '' };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid email');
    });

    it('should throw an error for an email without proper format', () => {
        const candidateData = { ...validCandidateData, email: 'john.doe' };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid email');
    });

    it('should validate a correct phone number', () => {
        const candidateData = { ...validCandidateData, phone: '623456789' };
        expect(() => validateCandidateData(candidateData)).not.toThrow();
    });

    it('should throw an error for an invalid phone number', () => {
        const candidateData = { ...validCandidateData, phone: '12345' };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid phone');
    });

    it('should throw an error for an address that is too long', () => {
        const candidateData = { ...validCandidateData, address: 'A'.repeat(101) }; // Assuming the maximum length is 255 characters
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid address');
    });

    it('should validate correct education data', () => {
        const candidateData = {
            ...validCandidateData,
            educations: [
                { institution: 'University A', title: 'Bachelor of Science', startDate: '2010-09-01', endDate: '2014-06-30' },
                { institution: 'University B', title: 'Master of Science', startDate: '2015-09-01', endDate: '2017-06-30' }
            ]
        };
        expect(() => validateCandidateData(candidateData)).not.toThrow();
    });

    it('should throw an error for invalid education institution name', () => {
        const candidateData = {
            ...validCandidateData,
            educations: [
                { institution: '', title: 'Bachelor of Science', startDate: '2010-09-01', endDate: '2014-06-30' },
                { institution: 'University B', title: 'Master of Science', startDate: '2015-09-01', endDate: '2017-06-30' }
            ]
        };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid institution');
    });

    it('should throw an error for invalid education title', () => {
        const candidateData = {
            ...validCandidateData,
            educations: [
                { institution: 'University A', title: '', startDate: '2010-09-01', endDate: '2014-06-30' },
                { institution: 'University B', title: 'Master of Science', startDate: '2015-09-01', endDate: '2017-06-30' }
            ]
        };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid title');
    });

    it('should throw an error for invalid education dates', () => {
        const candidateData = {
            ...validCandidateData,
            educations: [
                { institution: 'University A', title: 'Bachelor of Science', startDate: '2010-09-01', endDate: 'invalid-date' },
                { institution: 'University B', title: 'Master of Science', startDate: 'invalid-date', endDate: '2017-06-30' }
            ]
        };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid end date');
    });

    it('should validate correct work experience data', () => {
        const candidateData = {
            ...validCandidateData,
            workExperiences: [
                { company: 'Company A', position: 'Developer', description: 'Developed various applications', startDate: '2018-01-01', endDate: '2020-12-31' },
                { company: 'Company B', position: 'Senior Developer', description: 'Led a team of developers', startDate: '2021-01-01', endDate: '2023-01-01' }
            ]
        };
        expect(() => validateCandidateData(candidateData)).not.toThrow();
    });

    it('should throw an error for invalid work experience company name', () => {
        const candidateData = {
            ...validCandidateData,
            workExperiences: [
                { company: '', position: 'Developer', description: 'Developed various applications', startDate: '2018-01-01', endDate: '2020-12-31' },
                { company: 'Company B', position: 'Senior Developer', description: 'Led a team of developers', startDate: '2021-01-01', endDate: '2023-01-01' }
            ]
        };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid company');
    });

    it('should throw an error for invalid work experience position', () => {
        const candidateData = {
            ...validCandidateData,
            workExperiences: [
                { company: 'Company A', position: '', description: 'Developed various applications', startDate: '2018-01-01', endDate: '2020-12-31' },
                { company: 'Company B', position: 'Senior Developer', description: 'Led a team of developers', startDate: '2021-01-01', endDate: '2023-01-01' }
            ]
        };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid position');
    });

    it('should throw an error for invalid work experience dates', () => {
        const candidateData = {
            ...validCandidateData,
            workExperiences: [
                { company: 'Company A', position: 'Developer', description: 'Developed various applications', startDate: 'invalid-date', endDate: '2020-12-31' },
                { company: 'Company B', position: 'Senior Developer', description: 'Led a team of developers', startDate: '2021-01-01', endDate: 'invalid-date' }
            ]
        };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid date');
    });

    it('should throw an error for invalid CV data with missing fields', () => {
        const candidateData = {
            ...validCandidateData,
            cv: { filePath: '', fileType: '' }
        };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid CV data');
    });

    it('should throw an error for invalid CV data with incorrect types', () => {
        const candidateData = {
            ...validCandidateData,
            cv: { filePath: 123, fileType: true }
        };
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid CV data');
    });

    it('should not throw an error for valid CV data', () => {
        const candidateData = {
            ...validCandidateData,
            cv: { filePath: 'resume.pdf', fileType: 'pdf' }
        };
        expect(() => validateCandidateData(candidateData)).not.toThrow();
    });
});


import { PrismaClient } from '@prisma/client';
// CANDIDATE ADDING SERVICE
describe('addCandidate', () => {
    it('should add a candidate successfully', async () => {
      
        const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '623456789',
            address: '123 Main St, Anytown, AT 12345',
            educations: [
                { institution: 'University A', title: 'Bachelor of Science', startDate: '2010-09-01', endDate: '2014-06-30' },
                { institution: 'University B', title: 'Master of Science', startDate: '2015-09-01', endDate: '2017-06-30' }
            ],
            workExperiences: [
                { company: 'Company A', position: 'Developer', description: 'Developed various applications', startDate: '2018-01-01', endDate: '2020-12-31' },
                { company: 'Company B', position: 'Senior Developer', description: 'Led a team of developers', startDate: '2021-01-01', endDate: '2023-01-01' }
            ],
            cv: { filePath: 'path/to/resume.pdf', fileType: 'pdf' }
        };
        const prisma = new PrismaClient();
        const result = await addCandidate(candidateData);
        expect(result.id).toBe(1);
        expect(result.firstName).toBe('John');
        expect(result.lastName).toBe('Doe');
        expect(result.email).toBe('john.doe@example.com');
        expect(result.phone).toBe('623456789');
        expect(result.address).toBe('123 Main St, Anytown, AT 12345');

        expect(prisma.candidate.create).toHaveBeenCalled();
        expect(prisma.candidate.create).toHaveBeenCalledWith({
            data: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '623456789',
                address: '123 Main St, Anytown, AT 12345'
              }
        });
        expect(prisma.education.create).toHaveBeenCalled();
        expect(prisma.education.create).toHaveBeenCalledWith(
            { data: 
                {"candidateId": 1, 
                "endDate": new Date("2014-06-30"), 
                "institution": "University A", "startDate": new Date("2010-09-01"), 
                "title": "Bachelor of Science"}}
        );
        expect(prisma.education.create).toHaveBeenCalledWith(
            {data: {"candidateId": 1, "endDate": new Date("2014-06-30"), "institution": "University A", "startDate": new Date("2010-09-01"), "title": "Bachelor of Science"}}
        );
        expect(prisma.workExperience.create).toHaveBeenCalled();
        expect(prisma.workExperience.create).toHaveBeenCalledWith(
            {data: {"candidateId": 1, "company": "Company A", "description": "Developed various applications", "endDate": new Date("2020-12-31"), "position": "Developer", "startDate": new Date("2018-01-01")}}
        );
        expect(prisma.workExperience.create).toHaveBeenCalledWith(
            {data: {"candidateId": 1, "company": "Company B", "description": "Led a team of developers", "endDate": new Date("2023-01-01"), "position": "Senior Developer", "startDate": new Date("2021-01-01")}}
        );
        expect(prisma.resume.create).toHaveBeenCalled();
        expect(prisma.resume.create).toHaveBeenCalledWith(
            {data: {"candidateId": 1, "filePath": "path/to/resume.pdf", "fileType": "pdf", "uploadDate": expect.any(Date)}}
        );
    });


  
  });


// CANDIDATE ADDING SERVICE WITH MOCKING VALIDATION
describe('addCandidate mocking validation', () => {

    beforeEach(() => {
        jest.resetModules(); // Reset modules to ensure clean state
        jest.mock('../application/validator', () => ({
          validateCandidateData: jest.fn(() => {
            throw new Error('Invalid candidate data');
          })
        }));
      });
    
    it('should throw an error if candidate data validation fails', async () => {

        const { addCandidate } = await import('../application/services/candidateService');
        const candidateData = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '1234567890',
        address: '456 Elm St, Othertown, OT 67890'
        };
        
        await expect(addCandidate(candidateData)).rejects.toThrow('Invalid candidate data');
    });
    afterEach(() => {
        jest.restoreAllMocks(); // Restore all mocks to their original state
    });

});


// TESTING MODELS (CANDIDATE) 
// Testear modelos y servicios de dominio por separado añade demasiada complejidad para el beneficio de 
// desacoplar el testing. 
// Esto hace que el testing sea mas lento y complejo. 
// Por eso, solo se realizan tests de integración. 

import { Candidate } from '../domain/models/Candidate';

describe('addCandidate', () => {
    it('should add a candidate successfully', async () => {

        // Create a new candidate instance
        const candidate = new Candidate({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' });

        // Call the save method which should internally use prisma.candidate.create
        const savedCandidate = await candidate.save();

        // Assert that the returned object has the expected properties
        expect(savedCandidate).toEqual(expect.objectContaining({ id: 1, firstName: 'John', lastName: 'Doe' }));
    });

});
