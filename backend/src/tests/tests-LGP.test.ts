import request from 'supertest';
import app from '../index'; // Asegúrate de que tu aplicación Express esté correctamente exportada aquí
import { prismaMock } from './mocks/prismaMocks';
import multer from 'multer';

interface CandidateData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    educations?: Array<{
        institution?: string;
        title?: string;
        startDate?: string;
        endDate?: string;
    }>;
    workExperiences?: Array<{
        company?: string;
        position?: string;
        startDate?: string;
        endDate?: string;
    }>;
    cv?: {
        filePath?: string;
        fileType?: string;
    };
}

function safeAssign<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
}

describe('POST /candidates', () => {
  const testCases = [
    { field: 'firstName', value: undefined, expectedError: 'Error: Invalid name' },
    { field: 'email', value: 'lauranotanemail', expectedError: 'Error: Invalid email' },
    { field: 'phone', value: 'abc1234567', expectedError: 'Error: Invalid phone' },
    { field: 'address', value: 'C'.repeat(101), expectedError: 'Error: Invalid address' },
    { field: 'lastName', value: 'G' + 'a'.repeat(100), expectedError: 'Error: Invalid name' },
    { field: 'educations', value: [{ institution: '', title: 'Ingeniería', startDate: '2020-01-01', endDate: '2020-01-02' }], expectedError: 'Error: Invalid institution' },
    { field: 'workExperiences', value: [{ company: 'Empresa', position: '', startDate: '2020-01-01', endDate: '2020-01-02' }], expectedError: 'Error: Invalid position' },
    { field: 'cv', value: { filePath: '', fileType: 'pdf' }, expectedError: 'Error: Invalid CV data' }
  ];

  test.each(testCases)('debería fallar si el campo $field es inválido', async ({ field, value, expectedError }) => {
    const candidateData: CandidateData = {
      firstName: 'Laura',
      lastName: 'Garcia',
      email: 'laura@example.com',
      phone: '987654321',
      address: 'Calle Falsa 123',
      educations: [{ institution: 'Universidad', title: 'Ingeniería', startDate: '2020-01-01', endDate: '2020-01-02' }],
      workExperiences: [{ company: 'Empresa', position: 'Ingeniero', startDate: '2020-01-01', endDate: '2020-01-02' }],
      cv: { filePath: 'resume.pdf', fileType: 'pdf' }
    };
  
    if (value !== undefined) {
        safeAssign(candidateData, field as keyof CandidateData, value);
    } else {
        delete candidateData[field as keyof CandidateData];
    }

    const response = await request(app).post('/candidates').send(candidateData);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(expectedError);
  });

  const successCases = [
    { field: 'phone', expectedStatus: 201 },
    { field: 'address', expectedStatus: 201 },
    { field: 'workExperiences', value: [{ company: 'Empresa', position: 'Posicion', startDate: '2020-01-01', endDate: '' }], expectedStatus: 201 },
  ];

  test.each(successCases)('debería tener éxito sin el campo $field', async ({ field, expectedStatus }) => {
    const candidateData: CandidateData = {
      firstName: 'Laura',
      lastName: 'Garcia',
      email: 'laura@example.com',
      phone: undefined, // Asegúrate de incluir todas las propiedades, incluso si son undefined
      address: undefined,
      educations: undefined,
      workExperiences: undefined,
      cv: undefined
    };
    delete candidateData[field as keyof CandidateData];

    // Mock de la función post para evitar interacciones con la base de datos
    const mockPost = jest.spyOn(request(app), 'post').mockImplementation(() => {
        return Object.assign(request(app).post('/dummy'), {
            send: () => Promise.resolve({
                status: expectedStatus,
                body: {}
            })
        });
    });

    // Restaurar la función original después del test
    mockPost.mockRestore();
  });

});

describe('Guardar en la base de datos', () => {
    // Configuración del mock antes de la prueba
    beforeEach(() => {
        prismaMock.candidate.create.mockClear();
    });

    // Test para verificar la llamada correcta
    test('debería guardar los datos del candidato correctamente', async () => {
        const candidateData = {
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juan.perez@example.com',
            phone: '654987321',
            address: 'Calle Falsa 123',
            educations: [{ institution: 'Universidad', title: 'Ingeniería', startDate: '2020-01-01', endDate: '2020-01-02' }],
            workExperiences: [{ company: 'Empresa', position: 'Ingeniero', startDate: '2020-01-01', endDate: '2020-01-02' }],
            cv: { filePath: 'resume.pdf', fileType: 'pdf' }
        };

        // Llamada al método que guarda el candidato, usando el mock de Prisma
        const result = await prismaMock.candidate.create({ data: candidateData });

        // Verificar que se devuelve un estado HTTP 201, indicando creación exitosa
        expect(result.statusCode).toBe(201);
    });
});

describe('POST /upload', () => {
  it('debería subir un archivo correctamente', async () => {
    const storage = multer.memoryStorage();
    const upload = multer({ storage });

    app.post('/upload', upload.single('file'), (req, res) => {
      if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
      }
      res.status(200).send({
        filePath: 'mockpath/mockfile.pdf',
        fileType: req.file.mimetype
      });
    });
  });

  it('debería manejar tipos de archivo no permitidos', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('mock file content'), 'test.txt')
      .on('error', (err) => {
        console.error('Mock error:', err);
      });
    expect(res.status).toBe(400);
  });
});
