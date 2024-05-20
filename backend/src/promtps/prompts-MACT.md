## Para las valicaciones

Quiero que me ayudes a analizar que debo hacer para agregar pruebas unitarias con jest en el directorio backend

Por favor considera las pruebas unitarias que tenemos que hacer para el archivo @validator.ts y donde debemos ubicar el archivo de prueba

En este ejemplo me indicas crear el directorio de pruebasdentro de application, sin embargo me surge la duda si dentro de cada directorio de código deb crear la carpeta __test__ o debo crear uno solo y por dentro replicar la estructura de directorios de mi código?

Ahora por favor piensa en los test que deberíamos definir para este archivo validator.ts, por favor aún no crees código, solo planteame un listado de las pruebas que se te ocurren. Considera los valores límites para cada función de validación.

Quisiera agregar pruebas para nonbres con exactamente 2 carateres y 100 caracteres. Además con caracteres especiales como espacios

Por favor dame el código completo para las pruebas

Vamos con las pruebas para las demás funciones

Yo puedo lanzar las pruebas depurando? Aclaro que este lo hice por curiosidad para depurar algunos casos que no pasaban.

## Para los servicios

Quiero que me ayudes a pensar como podemos realizar pruebas de los servicios en el backend

Recuerda que el mock que queremos hacer es para la creación de candidatos

Ahora indicame como proceder para aplicar la prueba del guardado de un candidato usando este mock

For the code present, we get this error:
```
La propiedad 'mock' no existe en el tipo 'typeof Candidate'.
```
How can I resolve this? If you propose a fix, please make it concise

Quiero que examines el modelo @Candidate.ts y me indiques si con la prueba que ya realizamos en @candidateService.test.ts es suficiente o en otro caso que me listes en formato tablas las pruebas que se te ocurren que debemos hacer para garantizar el buen funcionamiento de nuestro servicio. Por favor no generes código, solo vamos a planear las pruebas. Aplica aquí tu conocimiento como experto en aseguramiento de calidad.

Pero para probar por ejemplo un email ya existen, debemos hacer un mock de esta respuesta o no?

Pero al hacerlo así, como podriamos agregar diferentes mocks para detallar casos existosos y casos fallidos?

Perfecto, estamos listos para implementar las pruebas de nuestro servicio. Por favor genérame las pruebas de la tabla que me entregaste anteriormente. Por favor ten en cuentaque cada prueba puede necesitar un mock propio.