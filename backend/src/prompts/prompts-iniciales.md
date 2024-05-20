## Prompt usando small-cursor

1. **Pregunta inicial para implementar los tests**

You're an expert in testing with TDD. Using `@backend` as context, I need you to write unit tests in `@test-iniciales.test.ts` using ts-jest (I have already installed it) to insert a candidate in the db. Before start ask me what questions you have. 

```markdown
To write unit tests for inserting a candidate in the database using ts-jest, you can follow these steps:
1. Install @types/jest if not already installed.
2. Create a test file named test-iniciales.test.ts in the tests directory.
3. Use jest.mock to mock the prisma client.
4. Write test cases to cover the addCandidate function in candidateService.ts.
5. Ensure to test both successful insertion and error handling scenarios.
```


2. **Escogiendo los pasos que propuso para que los implemente**

I need you to do the step 3 and 5 if needed. Also add the script in `@package.json` to test the functions

3. **Especificando que haga el mock del cliente de Prisma**

Modify `@test-iniciales.test.ts` to use jest.mock to mock the prisma client.

4. **El primer test que escribió falló y le pedi una corrección**

I have the following issue 
can you fix it so the test can pass?

```
addCandidate function › should insert a candidate into the database

    TypeError: Cannot read properties of undefined (reading 'id')

      15 |     try {
      16 |         const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
    > 17 |         const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado
         |                                            ^
      18 |
      19 |         // Guardar la educación del candidato
      20 |         if (candidateData.educations) {

      at src/application/services/candidateService.ts:17:44
      at step (src/application/services/candidateService.ts:33:23)
      at Object.next (src/application/services/candidateService.ts:14:53)
      at fulfilled (src/application/services/candidateService.ts:5:58)
```




