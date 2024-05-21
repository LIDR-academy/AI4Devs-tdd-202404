# Prompts IOA

No puedo ver todo el histórico de prompts, pero incluyo este prompt del que partí, en el que dividí en 3 partes:
1. La primera parte la hizo de forma muy sencilla.
2. En la segunda parte tuve dificultades en que entendiese cómo hacer los mocks. Empezó haciendo mock de todo el modelo Candidate, pero me pareció que para una funcionalidad tan sencilla añadía demasiada sobreingeniería en la creación de mocks.
3. Por último le pedí que testeásemos la app a nivel de endpoints.

---

Quiero crear test unitarios para la funcionalidad de crear un candidato, haremos 3 sets de tests:
1. validator en `validator.ts`.
2. función `addCandidate` en `candidateService.js`, donde tendremos que poner los mocks necesarios para no pisar la base de datos con los tests.
3. recepción de los datos de usuario en el controlador `candidateController.ts`.

Me gustaría preguntarte cómo enfocarías los tests de la suite número 2, ya que incluye el servicio `candidateService` y los modelos que tenemos en `models`. Quiero un enfoque práctico que no tenga demasiada sobreingeniería en la creación de mocks. Es decir, hay que balancear entre la complejidad de la funcionalidad y la creación de mocks. No implementes ningún test todavía.

No me termina de convencer esto, porque hacer un mock de estos modelos aporta mucha complejidad al tests y no me resulta útil, preferiría hacer un enfoque en el que tenga un mock del cliente de prisma.

Finally, I want to create a test the router with an http client. Which tests could you provide to test this? `candidateRoutes.ts`. Do not write tests yet.

