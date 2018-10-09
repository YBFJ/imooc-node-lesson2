// 数据流的读写和搬运
var fs = require('fs');

var readStream = fs.createReadStream('1.mp4');
var writeStram = fs.createWriteStream('1-stream.mp4');

readStream.on('data', function(chunk) {
  if (writeStram.write(chunk) === false) {
    // 防止读的快写的慢，然后服务器爆仓了，判断一下
    console.log('stull cached');
    readStream.pause();
  }
});

readStream.on('end', function() {
  writeStram.end();
});

writeStram.on('drain', function() {
  console.log('data drains');

  readStream.resume();
});
