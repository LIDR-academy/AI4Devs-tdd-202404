/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  // Automáticamente resetea los mocks antes de cada test
  //resetMocks: true,

  // Habilita el uso de mocks desde la carpeta __mocks__
  automock: false,  // Esto debería estar en false para no mockear todo automáticamente

  // Ruta base para la resolución de módulos
  //rootDir: './',  // Asegúrate de que esto apunta al directorio raíz de tu proyecto
};