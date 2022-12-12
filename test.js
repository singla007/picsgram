const fs = require('fs')

const readStream = fs.createReadStream('./hello.txt');
  const writeStream = fs.createWriteStream('output.txt');
  readStream.pipe(writeStream);
  // fileStream.on('error', function (err) {
  //   console.log(err);
  // })
  writeStream.on('end', () => {
    console.log('Data written to output.txt');
  });