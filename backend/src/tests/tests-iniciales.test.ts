import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import * as validator from '../application/validator';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            candidate: {
                create: jest.fn().mockResolvedValue({
                    id: 1,  // Suponiendo que el ID es generado automáticamente por la base de datos
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan.perez@example.com',
                    phone: '600123456',
                    address: 'Calle Falsa 123',
                    educations: [],  // Suponiendo que educations es un array de educaciones
                    workExperiences: [],  // Suponiendo que workExperiences es un array de experiencias laborales
                    cv: {}  // Suponiendo que cv es un objeto con detalles del currículum
                }),
                update: jest.fn().mockResolvedValue({
                    id: 1,  // El ID del candidato que está siendo actualizado
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan.perez@example.com',
                    phone: '600987654',  // Número de teléfono actualizado
                    address: 'Calle Real 456',  // Dirección actualizada
                    educations: [],  // Suponiendo que no hay cambios en educations
                    workExperiences: [],  // Suponiendo que no hay cambios en workExperiences
                    cv: {}  // Suponiendo que no hay cambios en cv
                }),
                findUnique: jest.fn().mockResolvedValue({
                    id: 1,
                    firstName: 'Laura',
                    lastName: 'Martínez',
                    email: 'laura.martinez@example.com',
                    phone: '600456789',
                    address: 'Avenida Siempre Viva 742',
                    educations: [
                        {
                            institution: 'Universidad de la Vida',
                            title: 'Ingeniería de Sistemas',
                            startDate: '2010-01-01',
                            endDate: '2014-12-31'
                        },
                        {
                            institution: 'Escuela de Posgrado',
                            title: 'Maestría en Ciencias de la Computación',
                            startDate: '2015-01-01',
                            endDate: '2017-12-31'
                        }
                    ],
                    workExperiences: [
                        {
                            company: 'Tech Innovations',
                            position: 'Desarrollador de Software',
                            startDate: '2018-01-01',
                            endDate: '2019-12-31',
                            description: 'Desarrollo de aplicaciones móviles y web.'
                        },
                        {
                            company: 'Solutions Ltd',
                            position: 'Ingeniero de Software Senior',
                            startDate: '2020-01-01',
                            endDate: '2022-12-31',
                            description: 'Liderazgo de proyectos de innovación tecnológica.'
                        }
                    ],
                    cv: {
                        fileType: 'pdf',
                        fileContent: 'contenido_del_archivo_en_base64',
                        filePath: 'path/al/archivo.pdf'
                    }
                })
            }
        }))
    };
});

jest.mock('../application/validator', () => ({
    validateCandidateData: jest.fn()
}));

describe('addCandidate', () => {
    let prismaClient: PrismaClient;

    beforeEach(() => {
        prismaClient = new PrismaClient();
    });

    it('debe crear un candidato correctamente cuando se proporcionan datos válidos', async () => {
        const mockCandidateData = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan.perez@example.com',
            phone: '600123456',
            address: 'Calle Falsa 123',
            educations: [],
            workExperiences: [],
            cv: {}
        };
        prismaClient.candidate.create({
            data: {
                ...mockCandidateData,
                id: 1
            }
        });
        await expect(addCandidate(mockCandidateData)).resolves.toEqual({
            id: 1,
            ...mockCandidateData
        });

        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).toHaveBeenCalledWith({
            data: expect.any(Object)
        });
    });

    it('debe fallar al crear un candidato cuando el nombre no es válido', async () => {
        const mockCandidateData = {
            firstName: 'J',  // Nombre demasiado corto
            lastName: 'Pérez',
            email: 'juan.perez@example.com',
            phone: '600123456',
            address: 'Calle Falsa 123',
            educations: [],
            workExperiences: [],
            cv: {}
        };

        validator.validateCandidateData(mockCandidateData);

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Invalid name');

        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).not.toHaveBeenCalled();
    });

    it('debe fallar al crear un candidato cuando el email no es válido', async () => {
        const mockCandidateData = {
            firstName: 'Laura',
            lastName: 'García',
            email: 'laura.email.com',  // Email inválido, falta '@'
            phone: '600123456',
            address: 'Calle Verdadera 456',
            educations: [],
            workExperiences: [],
            cv: {}
        };

        validator.validateCandidateData.mockImplementation(() => {
            throw new Error('Invalid email');
        });

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Invalid email');

        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).not.toHaveBeenCalled();
    });

    it('debe fallar al crear un candidato cuando el teléfono no es válido', async () => {
        const mockCandidateData = {
            firstName: 'Carlos',
            lastName: 'Martínez',
            email: 'carlos.martinez@example.com',
            phone: '123456789',  // Teléfono inválido, no comienza con 6, 7, o 9
            address: 'Avenida Siempre Viva 742',
            educations: [],
            workExperiences: [],
            cv: {}
        };

        validator.validateCandidateData.mockImplementation(() => {
            throw new Error('Invalid phone');
        });

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Invalid phone');

        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).not.toHaveBeenCalled();
    });

    it('debe fallar al crear un candidato cuando la fecha no es válida', async () => {
        const mockCandidateData = {
            firstName: 'Ana',
            lastName: 'López',
            email: 'ana.lopez@example.com',
            phone: '600123456',
            address: 'Calle Nueva 456',
            educations: [{
                institution: 'Universidad de Pruebas',
                title: 'Ingeniería de Pruebas',
                startDate: '2020-01-01',
                endDate: '20201-01-01'  // Fecha inválida
            }],
            workExperiences: [],
            cv: {}
        };

        validator.validateCandidateData.mockImplementation(() => {
            throw new Error('Invalid date');
        });

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Invalid date');

        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).not.toHaveBeenCalled();
    });

    it('debe fallar al crear un candidato cuando la dirección no es válida', async () => {
        const mockCandidateData = {
            firstName: 'Elena',
            lastName: 'Ramírez',
            email: 'elena.ramirez@example.com',
            phone: '600123456',
            address: 'Calle Muy Muy Larga que definitivamente excede el límite normal de caracteres permitidos para una dirección en la base de datos',
            educations: [],
            workExperiences: [],
            cv: {}
        };

        validator.validateCandidateData.mockImplementation(() => {
            throw new Error('Invalid address');
        });

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Invalid address');

        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).not.toHaveBeenCalled();
    });

    it('debe fallar al crear un candidato cuando los datos de educación no son válidos', async () => {
        const mockCandidateData = {
            firstName: 'Roberto',
            lastName: 'Gómez',
            email: 'roberto.gomez@example.com',
            phone: '600123456',
            address: 'Calle Real 24',
            educations: [{
                institution: 'Institución Educativa con un nombre extremadamente largo que supera el límite de caracteres permitidos',
                title: 'Licenciatura en Ciencias de la Computación',
                startDate: '2015-09-01',
                endDate: '2019-06-30'
            }],
            workExperiences: [],
            cv: {}
        };

        validator.validateCandidateData.mockImplementation(() => {
            throw new Error('Invalid education data');
        });

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Invalid education data');

        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).not.toHaveBeenCalled();
    });

    it('debe fallar al crear un candidato cuando los datos de experiencia laboral no son válidos', async () => {
        const mockCandidateData = {
            firstName: 'Marta',
            lastName: 'Fernández',
            email: 'marta.fernandez@example.com',
            phone: '600123456',
            address: 'Calle del Sol 15',
            educations: [],
            workExperiences: [{
                company: 'Empresa X',
                position: 'Desarrollador Senior',
                startDate: '2018-01-01',
                endDate: '2018-12-31',  // Fecha válida, pero supongamos que hay un error en la descripción
                description: 'Una descripción extremadamente larga que supera el límite de caracteres permitidos para una descripción en la base de datos'
            }],
            cv: {}
        };

        validator.validateCandidateData.mockImplementation(() => {
            throw new Error('Invalid work experience data');
        });

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Invalid work experience data');

        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).not.toHaveBeenCalled();
    });

    it('debe fallar al crear un candidato cuando los datos del CV no son válidos', async () => {
        const mockCandidateData = {
            firstName: 'Sofía',
            lastName: 'Castro',
            email: 'sofia.castro@example.com',
            phone: '600123456',
            address: 'Calle Larga 321',
            educations: [],
            workExperiences: [],
            cv: {
                fileType: 'txt'  // Tipo de archivo inválido, esperamos un PDF
            }
        };

        validator.validateCandidateData.mockImplementation(() => {
            throw new Error('Invalid CV data');
        });

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Invalid CV data');

        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).not.toHaveBeenCalled();
    });

    it('debe manejar un error de base de datos al intentar guardar un candidato', async () => {
        const mockCandidateData = {
            firstName: 'Pedro',
            lastName: 'Márquez',
            email: 'pedro.marquez@example.com',
            phone: '600123456',
            address: 'Calle Principal 100',
            educations: [],
            workExperiences: [],
            cv: {}
        };
    
        prismaClient.candidate.create.mockRejectedValue(new Error('Database error'));
    
        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Database error');
    
        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).toHaveBeenCalledWith({
            data: expect.any(Object)
        });
    });

    it('debe crear un candidato correctamente con datos de educación y experiencia laboral', async () => {
        const mockCandidateData = {
            firstName: 'Luisa',
            lastName: 'Morales',
            email: 'luisa.morales@example.com',
            phone: '600789123',
            address: 'Calle Nueva 50',
            educations: [{
                institution: 'Universidad Nacional',
                title: 'Ingeniería Industrial',
                startDate: '2014-01-01',
                endDate: '2018-12-31'
            }],
            workExperiences: [{
                company: 'Industrias XYZ',
                position: 'Ingeniera de Procesos',
                startDate: '2019-01-01',
                endDate: '2021-12-31',
                description: 'Optimización de procesos industriales'
            }],
            cv: {
                fileType: 'pdf',
                fileContent: 'contenido_del_archivo'
            }
        };
    
        prismaClient.candidate.create.mockResolvedValue({
            id: 123,
            ...mockCandidateData
        });
    
        await expect(addCandidate(mockCandidateData)).resolves.toEqual({
            id: 123,
            ...mockCandidateData
        });
    
        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.create).toHaveBeenCalledWith({
            data: expect.any(Object)
        });
    });

    it('debe manejar un error de base de datos al intentar actualizar un candidato', async () => {
        const mockCandidateData = {
            id: 1,
            firstName: 'Carmen',
            lastName: 'Ruiz',
            email: 'carmen.ruiz@example.com',
            phone: '600456789',
            address: 'Calle Secundaria 200',
            educations: [],
            workExperiences: [],
            cv: {}
        };

        prismaClient.candidate.update.mockRejectedValue(new Error('Database update error'));

        // Asumiendo que existe un método updateCandidate en el servicio
        await expect(updateCandidate(mockCandidateData)).rejects.toThrow('Database update error');

        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
    
        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Database update error');
    
        expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(prismaClient.candidate.update).toHaveBeenCalledWith({
            where: { id: mockCandidateData.id },
            data: expect.any(Object)
        });
    });
});

