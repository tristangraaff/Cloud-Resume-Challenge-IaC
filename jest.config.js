export default {
  // Tell Jest to treat .mjs files as ES modules.
  //extensionsToTreatAsEsm: ['.mjs'],

  // Use babel-jest to transform the ES module code.
  transform: {
    //'^.+\\.mjs$': 'babel-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.mjs$',
  // Optionally specify the test environment (the default is 'node').
  testEnvironment: 'node'
};