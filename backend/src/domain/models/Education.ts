import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export interface EducationData {
    id?: number;
    institution: string;
    title: string;
    startDate: Date;
    endDate?: Date;
    candidateId?: number;
}
export class Education {
    id?: number;
    institution: string;
    title: string;
    startDate: Date;
    endDate?: Date;
    candidateId?: number;

    constructor(data: any) {
        this.id = data.id;
        this.institution = data.institution;
        this.title = data.title;
        this.startDate = new Date(data.startDate);
        this.endDate = data.endDate ? new Date(data.endDate) : undefined;
        this.candidateId = data.candidateId;
    }

    async save(candidateId: number) {
        const educationData: any = {
            institution: this.institution,
            title: this.title,
            startDate: this.startDate,
            endDate: this.endDate,
        };

        if (candidateId !== undefined) {
            educationData.candidateId = candidateId;
        }

        if (this.id) {
            // Actualizar una experiencia laboral existente
            return await prisma.education.update({
                where: { id: this.id },
                data: educationData
            });
        } else {
            // Crear una nueva experiencia laboral
            return await prisma.education.create({
                data: educationData
            });
        }
    }

    async findOne(id: number) {
        return prisma.education.findUnique({
            where: { id }
        });
    }

    static async findAll(candidateId: number) {
        return prisma.education.findMany({
            where: { candidateId }
        });
    }
}
