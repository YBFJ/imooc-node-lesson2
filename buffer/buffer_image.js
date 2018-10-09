var fs = require('fs');

fs.readFile('cat.png', function(err, origin_buffer) {
  console.log(Buffer.isBuffer(origin_buffer));

  fs.writeFile('cat_buffer.png', origin_buffer, function(err) {
    if (err) console.log(err);
  });

  // var base64Img = new Buffer(origin_buffer).toString('base64')
  var base64Img = origin_buffer.toString('base64');
  console.log(base64Img);

  var decodedImg = new Buffer(base64Img, 'base64');

  console.log(Buffer.compare(origin_buffer, decodedImg));

  fs.writeFile('cat_decoded.png', decodedImg, function(err) {
    if (err) console.log(err);
  });
});
