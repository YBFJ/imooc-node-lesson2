var http = require('http');
var fs = require('fs');
var request = require('request');

http
  .createServer(function(req, res) {
    // 普通的读取途径
    // fs.readFile('./', function(err, data) {
    //   if (err) {
    //     res.end('file not exist');
    //   } else {
    //     res.writeHeader(200, { 'Content-Type': 'text/html' });
    //     res.end(data);
    //   }
    // });
    // 数据流的读取本地的
    // fs.createReadStream('./').pipe(res);
    // 读取线上的
    request(
      'https://tse2-mm.cn.bing.net/th?id=OIP.PMF7KujJSO5WpIrYTwodcQHaEK&w=261&h=160&c=7&o=5&pid=1.7'
    ).pipe(res);
  })
  .listen(8090);
