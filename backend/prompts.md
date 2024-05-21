# Para los modelos

## Candidate

1. Eres un experto QA, para el modelo @Candidate.ts podrías generar los tests unitarios? Antes de empezar, hazme todas las preguntas que necesites. No escribas código aún.
2.

```
1. Dame los que recomiendes. La idea sería tener un code coverage alto.

2. Sí.

3. Ninguno.

4. Sí, mockealos.

5.Ninguna porque vas a mockear a Prisma.
```

3. Sí, escribelos
4.

```
TypeError: Cannot read properties of undefined (reading 'create')
```

Cómo podría solucionar este error?

5. En la línea 25 del archivo @Candidate.spec.ts hay una instancia de Prisma que se est'a creando, la cual no debería, ya que en el modelo de @Candidate.ts se está creando una, podrías ayudarme cambiando los tests teniendo en cuenta esto?

6. En base al error que acabas de corregir, podrías corregir los otros test?

## Education

1. Eres un experto QA que usa Jest. Basándote en los archivos @Candidate.spec.ts y @Candidate.ts , podrías generar los tests unitarios para el archivo @Education.ts ? Antes de empezar, hazme todas las preguntas que necesites. No escribas código aún.

2.

```
1. Sí
2. Sí
3. No
```

## Resume

1. Eres un experto QA que usa Jest. Basándote en los archivos @Candidate.spec.ts y @Candidate.ts , podrías generar los tests unitarios para el archivo @Resume.ts ? Antes de empezar, hazme todas las preguntas que necesites. No escribas código aún.

2.

```
1. Sí
2. Sí
3. No
4. Sí
```

## WorkExperience

1. Eres un experto QA que usa Jest. Basándote en los archivos @Candidate.spec.ts y @Candidate.ts , podrías generar los tests unitarios para el archivo @WorkExperience.ts ? Antes de empezar, hazme todas las preguntas que necesites. No escribas código an.

2.

```
1. Sí
2. Sí
3. No
4. No
```

# Para los servicios

## candidateService

1. Eres un experto QA que usa Jest. Podrias generar los tests unitarios para el archivo @candidateService.ts ? Antes de empezar, hazme todas las preguntas que necesites. No escribas código aún.

2.

```
1. Todas
2. En este momento no los tengo
3. Se espera que se guarde el candidato con sus datos y si falla alguna constraint o un error general, haya un throw.
4. Usemos mocks
5. Ninguna, todo será con mocks
```

3. En base al modelo @Candidate.ts y las pruebas @Candidate.spec.ts podrías complementer los tests de @candidateService.spec.ts teniendo en cuenta llenar los datos de ejemplo?

4. De los modelos de @candidateService.spec.ts podrías hacer mock solo de la función save de cada uno? recuerda dejar el constructor intacto

# fileUploadService

1. Eres un experto QA que usa Jest. Podrias generar los tests unitarios para cada una de las funciones del archivo @fileUploadService.ts ? Antes de empezar, hazme todas las preguntas que necesites. No escribas código aún.

2.

```
1. No quisiera que uses express, ni multer, quiero que hagas mocks.
2. Ninguno, mockea todas las dependencias externas
3. Todas las que mencionas
4. No
5. Me gustarían los ejemplos que mencionas
```

3.

```
TypeError: multer_1.default.diskStorage is not a function

      2 | import { Request, Response } from 'express';
      3 |
    > 4 | const storage = multer.diskStorage({
        |                        ^
      5 |     destination: function (req, file, cb) {
      6 |         cb(null, '../uploads/');
      7 |     },
```

cómo puedo solucionar este error?
