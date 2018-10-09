var stream = require('stream');

var util = require('util');
// 重写stream的Readable
function ReadStream() {
  stream.Readable.call(this);
}
// 原型链上面的继承第一个参数是要继承的函数，第二个是被继承的函数
util.inherits(ReadStream, stream.Readable);

// read前面要加下划线，私有函数，相当于重写这个函数了
ReadStream.prototype._read = function() {
  this.push('I');
  // this 是ReadStream方法
  this.push('love');
  this.push('cmj\n');
  this.push(null);
};

function WriteStream() {
  stream.Writable.call(this);
  this._cached = new Buffer('');
}
// 继承可写流的原型
util.inherits(WriteStream, stream.Writable);

// 重写可写流的read方法
WriteStream.prototype._write = function(chunk, encode, cb) {
  console.log(chunk.toString());
  cb();
};

function TransformStream() {
  stream.Transform.call(this);
}
util.inherits(TransformStream, stream.Transform);

// 重写transform的两个方法，一个是transform，另一个是flush
TransformStream.prototype._transform = function(chunk, encode, cb) {
  this.push(chunk);
  // 直接加上数据块
  cb();
};
TransformStream.prototype._flush = function(cb) {
  this.push('oh yeah!');
  cb();
};

var rs = new ReadStream();
var ws = new WriteStream();
var ts = new TransformStream();

// pipe登场时刻,rs先给ts进行额外的定制和处理（也就是加上oh yeah!）
rs.pipe(ts).pipe(ws);
