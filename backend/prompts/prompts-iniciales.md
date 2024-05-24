# Add Candidate Unit testing
## IDE: Cody AI + Codium AI

## Procedimiento
Debido a los múltiples errores para poder generar una test suite con lenguaje natural y herramientas como Cursor, se optó por hacer uso de la extensión `Codium AI` y luego corregir los errores con `Cody AI`.

De esta forma fue posible de forma rápida generar los tests de agregar un nuevo candidato.

La lección de este ejercicio es que todavía falta mucho para que las herramientas de IA nos provean una test suite funcional sobre todo al momento de hacer mock de dependencias. Aquí es donde entra el criterio técnico del desarrollador para corregir los errores. Sin conocimiento previo en testing, es difícil lograr obtener algo funcional.

## Secuencia de prompts a explorar para uso posterior

1. Teniendo el modelo de datos en el archivo <nombre-del-archivo> y la validación de datos en el archivo <nombre-del-archivo>, debes crear una suite de tests unitarios para el servicio <nombre-del-servicio>. Vamos a seguir el procedimiento a continuación:
    * Crea los mocks necesarios y prueba que la definición sea correcta antes de devolverme el resultado
    * Crea la definición de la test suite con el nombre <nombre-de-la-test-suite>
    * Haz uso de todos los hooks de Jest para:
        * Definir las clases e instancias necesarias
        * Limpiar los mocks para cada test suite
    * Crea el objeto de datos teniendo en cuenta la información del modelo de datos

2. Refactoriza la suite de tests para evitar repetir definiciones y mocks de datos
