const fs = require('fs');
const compile = require('google-closure-compiler-js').compile;

const fileIn = './src/iframe-action-communicator.js';
const fileOut = './dist/iframe-action-communicator.min.js';

console.info('Compiling... 😤');

fs.unlink(fileOut, () => {
  fs.readFile(fileIn, { encoding: 'utf-8' }, (err, data) => {
    if (err) throw err;
    const flags = {
      jsCode: [{ src: data }],
      languageIn: 'ES6',
      languageOut: 'ES5'
    };
    const out = compile(flags);
    fs.writeFile(fileOut, out.compiledCode, (error) => {
      if (error) throw error;
      console.info('Compilation was a success! 😎 🍺');
    });
  });
});
