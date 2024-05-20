import { validateCandidateData } from "../application/validator";


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





