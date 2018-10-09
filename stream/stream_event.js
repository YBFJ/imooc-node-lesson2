// sream 读写事件
var fs = require('fs');

var readStream = fs.createReadStream('stream_copy_logo.js');
// 'stream_copy_logo.js'可以换成视频图像什么的，可以看流的传递速度
var n = 0;

readStream
  .on('data', function(chunk) {
    n++;
    console.log('data emit');
    console.log(Buffer.isBuffer(chunk));
    //console.log(chunk.toString('utf8'));
    readStream.pause();
    // 暂停数据流
    console.log('data pause');
    setTimeout(function() {
      console.log('data pause end');
      readStream.resume();
      // 重启数据的传递
    }, 1000);
  })
  .on('readable', function() {
    console.log('data readable');
  })
  .on('end', function() {
    console.log(n);
    console.log('data ends');
  })
  .on('close', function() {
    console.log('data close');
  })
  .on('error', function(e) {
    console.log('data read error' + e);
  });
