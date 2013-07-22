function Hello() {
  this.hello = 'hello';
}

Hello.prototype.say = function() {
  var a = 100;
};

exports.Hello = Hello;
