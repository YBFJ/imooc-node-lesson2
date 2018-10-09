var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

var readStream = new Readable();
var writStream = new Writable();

readStream.push('I');
readStream.push('love');
readStream.push('cmj\n');
readStream.push(null);

writStream._write = function(chunk, encode, cb) {
  console.log(chunk.toString());
  cb();
};
readStream.pipe(writStream);
console.log(chunk.toString());
