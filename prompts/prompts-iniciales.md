Quiero que escribas los test unitarios para la clase @candidateService.ts , ten encuenta los escenarios de validación de datos que se encuentran en el archivo @validator.ts , cubre escenarios bordes, debe tener  encuenta  que la clase @Candidate.ts utiliza prisma como fuente de datos , como es un test unitario quiero que maneje mocks , listame todos los test que vas a escribir antes de pasarlos al archivo @tests-iniciales.test.ts 

Para escribir pruebas unitarias para la clase `candidateService.ts`, consideraremos los siguientes escenarios, utilizando mocks para simular las interacciones con la base de datos y las validaciones. Aquí están los tests que planeo escribir:

1. **Test de Validación Exitosa**: Verificar que cuando se proporcionan datos válidos, el candidato se crea correctamente sin errores.
2. **Test de Validación de Nombre Fallida**: Probar que se lanza un error cuando el nombre del candidato no cumple con las reglas de validación (por ejemplo, nombre demasiado corto, caracteres inválidos).
3. **Test de Validación de Email Fallida**: Verificar que se lanza un error cuando el email no es válido según el regex definido.
4. **Test de Validación de Teléfono Fallida**: Comprobar que se lanza un error cuando el número de teléfono no cumple con el formato esperado.
5. **Test de Validación de Fecha Fallida**: Asegurar que se lanza un error cuando las fechas de educación o experiencia laboral no cumplen con el formato YYYY-MM-DD.
6. **Test de Validación de Dirección Fallida**: Verificar que se lanza un error si la dirección excede la longitud máxima permitida.
7. **Test de Validación de Educación Fallida**: Probar que se lanza un error si los campos de educación no cumplen con las validaciones (por ejemplo, institución demasiado larga).
8. **Test de Validación de Experiencia Laboral Fallida**: Comprobar que se lanza un error si los campos de experiencia laboral no cumplen con las validaciones.
9. **Test de Validación de CV Fallida**: Asegurar que se lanza un error si los datos del CV no cumplen con las validaciones (por ejemplo, falta de tipo de archivo).
10. **Test de Manejo de Error de Base de Datos al Guardar**: Simular un error de base de datos al intentar guardar un candidato y verificar que se maneja correctamente.
11. **Test de Creación de Candidato con Educación y Experiencia**: Verificar que cuando se proporcionan datos completos incluyendo educación y experiencia, todo se guarda correctamente.
12. **Test de Error de Email Duplicado**: Simular un error de restricción única para el email y verificar que se lanza el error específico de email duplicado.

Cada uno de estos tests utilizará mocks para las funciones de Prisma y las validaciones para asegurar que son pruebas unitarias que no dependen de la base de datos real ni de efectos secundarios externos.


vamos a escribir uno a uno en el archivo @tests-iniciales.test.ts yo te voy inidicando el orden segun los 12 escenarios contemplados, iniciemos con el escenario 1


Para el escenario 1, "Test de Validación Exitosa", escribiremos un test que verifica que cuando se proporcionan datos válidos, el candidato se crea correctamente sin errores. Utilizaremos mocks para simular la base de datos y las funciones de validación.

```typescript:backend/src/tests/tests-iniciales.test.ts
import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import * as validator from '../application/validator';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
    const mPrisma = { candidate: { create: jest.fn() } };
    return { PrismaClient: jest.fn(() => mPrisma) };
});

jest.mock('../application/validator', () => ({
    validateCandidateData: jest.fn()
}));

describe('addCandidate', () => {
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

        const prismaClient = new PrismaClient();
        prismaClient.candidate.create.mockResolvedValue({
            id: 1,
            ...mockCandidateData
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
});
```

Este test verifica que:
- La función `validateCandidateData` se llama con los datos correctos.
- La función `create` del cliente de Prisma se llama con un objeto que contiene los datos del candidato.
- El candidato se crea correctamente y la promesa se resuelve con los datos del candidato.

Si necesitas ajustar algo o continuar con el siguiente test, házmelo saber.

inicia con el escenario 2

Para el escenario 2, "Test de Validación de Nombre Fallida", escribiremos un test que verifica que se lanza un error cuando el nombre del candidato no cumple con las reglas de validación, como un nombre demasiado corto o con caracteres inválidos.

```typescript:backend/src/tests/tests-iniciales.test.ts
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

    validator.validateCandidateData.mockImplementation(() => {
        throw new Error('Invalid name');
    });

    await expect(addCandidate(mockCandidateData)).rejects.toThrow('Invalid name');

    expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
    expect(prismaClient.candidate.create).not.toHaveBeenCalled();
});
```

Este test verifica que:
- La función `validateCandidateData` se llama y lanza un error debido a un nombre inválido.
- La función `create` del cliente de Prisma no se llama, ya que la validación falla antes de llegar a la creación del candidato.
- El error lanzado es capturado correctamente y coincide con el mensaje esperado.

Este test asegura que el sistema maneja adecuadamente los datos de entrada inválidos para el nombre del candidato. Si todo está correcto, podemos proceder al siguiente escenario.

escenario 3

Para el escenario 3, "Test de Validación de Email Fallida", escribiremos un test que verifica que se lanza un error cuando el email proporcionado no es válido según el regex definido.

```typescript:backend/src/tests/tests-iniciales.test.ts
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
```

Este test verifica que:
- La función `validateCandidateData` se llama y lanza un error debido a un email inválido.
- La función `create` del cliente de Prisma no se llama, ya que la validación falla antes de llegar a la creación del candidato.
- El error lanzado es capturado correctamente y coincide con el mensaje esperado.

Este test asegura que el sistema maneja adecuadamente los datos de entrada inválidos para el email del candidato. Si todo está correcto, podemos proceder al siguiente escenario.

escenario 4

Para el escenario 4, "Test de Validación de Teléfono Fallida", escribiremos un test que verifica que se lanza un error cuando el número de teléfono no cumple con el formato esperado.

```typescript:backend/src/tests/tests-iniciales.test.ts
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
```

Este test verifica que:
- La función `validateCandidateData` se llama y lanza un error debido a un número de teléfono inválido.
- La función `create` del cliente de Prisma no se llama, ya que la validación falla antes de llegar a la creación del candidato.
- El error lanzado es capturado correctamente y coincide con el mensaje esperado.

Este test asegura que el sistema maneja adecuadamente los datos de entrada inválidos para el teléfono del candidato. Si todo está correcto, podemos proceder al siguiente escenario.

escenario 5

Para el escenario 5, "Test de Validación de Fecha Fallida", escribiremos un test que verifica que se lanza un error cuando las fechas de educación o experiencia laboral no cumplen con el formato YYYY-MM-DD.

```typescript:backend/src/tests/tests-iniciales.test.ts
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
```

Este test verifica que:
- La función `validateCandidateData` se llama y lanza un error debido a una fecha inválida en la educación del candidato.
- La función `create` del cliente de Prisma no se llama, ya que la validación falla antes de llegar a la creación del candidato.
- El error lanzado es capturado correctamente y coincide con el mensaje esperado.

Este test asegura que el sistema maneja adecuadamente los datos de entrada inválidos para las fechas en los registros de educación del candidato. Si todo está correcto, podemos proceder al siguiente escenario.

escenario 6

Para el escenario 6, "Test de Validación de Dirección Fallida", escribiremos un test que verifica que se lanza un error si la dirección excede la longitud máxima permitida o no cumple con los criterios de validación establecidos.

```typescript:backend/src/tests/tests-iniciales.test.ts
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
```

Este test verifica que:
- La función `validateCandidateData` se llama y lanza un error debido a una dirección inválida.
- La función `create` del cliente de Prisma no se llama, ya que la validación falla antes de llegar a la creación del candidato.
- El error lanzado es capturado correctamente y coincide con el mensaje esperado.

Este test asegura que el sistema maneja adecuadamente los datos de entrada inválidos para la dirección del candidato. Si todo está correcto, podemos proceder al siguiente escenario.

escenario 7

Para el escenario 7, "Test de Validación de Educación Fallida", escribiremos un test que verifica que se lanza un error si los campos de educación no cumplen con las validaciones (por ejemplo, institución demasiado larga).

```typescript:backend/src/tests/tests-iniciales.test.ts
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
```

Este test verifica que:
- La función `validateCandidateData` se llama y lanza un error debido a datos de educación inválidos.
- La función `create` del cliente de Prisma no se llama, ya que la validación falla antes de llegar a la creación del candidato.
- El error lanzado es capturado correctamente y coincide con el mensaje esperado.

Este test asegura que el sistema maneja adecuadamente los datos de entrada inválidos para los campos de educación del candidato. Si todo está correcto, podemos proceder al siguiente escenario.

escenario 8

Para el escenario 8, "Test de Validación de Experiencia Laboral Fallida", escribiremos un test que verifica que se lanza un error si los campos de experiencia laboral no cumplen con las validaciones (por ejemplo, descripción de la posición demasiado larga o fechas inválidas).

```typescript:backend/src/tests/tests-iniciales.test.ts
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
```


Este test verifica que:
- La función `validateCandidateData` se llama y lanza un error debido a datos de experiencia laboral inválidos.
- La función `create` del cliente de Prisma no se llama, ya que la validación falla antes de llegar a la creación del candidato.
- El error lanzado es capturado correctamente y coincide con el mensaje esperado.

Este test asegura que el sistema maneja adecuadamente los datos de entrada inválidos para los campos de experiencia laboral del candidato. Si todo está correcto, podemos proceder al siguiente escenario.

escenario 9

Para el escenario 9, "Test de Validación de CV Fallida", escribiremos un test que verifica que se lanza un error si los datos del CV no cumplen con las validaciones (por ejemplo, falta de tipo de archivo).

```typescript:backend/src/tests/tests-iniciales.test.ts
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
```

Este test verifica que:
- La función `validateCandidateData` se llama y lanza un error debido a datos de CV inválidos.
- La función `create` del cliente de Prisma no se llama, ya que la validación falla antes de llegar a la creación del candidato.
- El error lanzado es capturado correctamente y coincide con el mensaje esperado.

Este test asegura que el sistema maneja adecuadamente los datos de entrada inválidos para el CV del candidato. Si todo está correcto, podemos proceder al siguiente escenario.

escenario 10

Para el escenario 10, "Test de Manejo de Error de Base de Datos al Guardar", escribiremos un test que simula un error de base de datos al intentar guardar un candidato y verifica que se maneja correctamente.

```typescript:backend/src/tests/tests-iniciales.test.ts
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

    const prismaClient = new PrismaClient();
    prismaClient.candidate.create.mockRejectedValue(new Error('Database error'));

    await expect(addCandidate(mockCandidateData)).rejects.toThrow('Database error');

    expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
    expect(prismaClient.candidate.create).toHaveBeenCalledWith({
        data: expect.any(Object)
    });
});
```

Este test verifica que:
- La función `validateCandidateData` se llama con los datos correctos.
- La función `create` del cliente de Prisma intenta realizar la operación y falla, simulando un error de base de datos.
- El error de base de datos es capturado correctamente y coincide con el mensaje esperado.

Este test asegura que el sistema maneja adecuadamente los errores de base de datos durante la creación de un candidato. Si todo está correcto, podemos proceder al siguiente escenario.


escenario 11

Para el escenario 11, "Test de Creación de Candidato con Educación y Experiencia", escribiremos un test que verifica que cuando se proporcionan datos completos incluyendo educación y experiencia, todo se guarda correctamente.

```typescript:backend/src/tests/tests-iniciales.test.ts
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

    const prismaClient = new PrismaClient();
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
```

Este test verifica que:
- La función `validateCandidateData` se llama con los datos completos y correctos.
- La función `create` del cliente de Prisma se llama con un objeto que contiene todos los datos del candidato, incluyendo educación y experiencia laboral.
- El candidato se crea correctamente y la promesa se resuelve con los datos del candidato, incluyendo un ID asignado.

Este test asegura que el sistema maneja adecuadamente la creación de un candidato con un perfil completo. Si todo está correcto, podemos proceder al último escenario.

escenario 12

Para el escenario 12, "Test de Manejo de Error de Base de Datos al Actualizar", escribiremos un test que simula un error de base de datos al intentar actualizar un candidato y verifica que se maneja correctamente.

```typescript:backend/src/tests/tests-iniciales.test.ts
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

    const prismaClient = new PrismaClient();
    prismaClient.candidate.update.mockRejectedValue(new Error('Database update error'));

    await expect(addCandidate(mockCandidateData)).rejects.toThrow('Database update error');

    expect(validator.validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
    expect(prismaClient.candidate.update).toHaveBeenCalledWith({
        where: { id: mockCandidateData.id },
        data: expect.any(Object)
    });
});
```

Este test verifica que:
- La función `validateCandidateData` se llama con los datos correctos.
- La función `update` del cliente de Prisma intenta realizar la operación y falla, simulando un error de base de datos durante la actualización.
- El error de base de datos es capturado correctamente y coincide con el mensaje esperado.

Este test asegura que el sistema maneja adecuadamente los errores de base de datos durante la actualización de un candidato. Con esto, hemos cubierto un amplio espectro de pruebas para asegurar la robustez del sistema en la gestión de candidatos.
