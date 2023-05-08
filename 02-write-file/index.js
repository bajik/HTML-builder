const fs = require('fs');
const path = require('path');
const {
  stdin: input,
  stdout: output,
} = require('process');
const readline = require('readline');

const readlineInterface = readline.createInterface({ input, output });

output.write('Enter text. To exit, enter "exit" or press "Ctrl+c"\n');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

readlineInterface.on('line', (inputText) => {
  if (inputText === 'exit') {
    output.write('\nEnd program');
    writeStream.end();
    process.exit();
  } else {
    writeStream.write(`${inputText}\n`);
  }
});

readlineInterface.on('SIGINT', () => {
  output.write('\nEnd program');
  writeStream.end();
  process.exit();
});
