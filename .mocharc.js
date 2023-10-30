/** @type {import('vscode-extension-tester').MochaOptions} */
module.exports = {
  reporter: "spec",
  slow: 75,
  timeout: 10000,
  ui: "bdd",
  // FIX: could not get ts-node to work with mocha
  // https://typestrong.org/ts-node/docs/recipes/mocha/
  // require: "ts-node/register", // for CommonJS
  // loader: "ts-node/esm", // for ESM
};
