
process.env.NODE_ENV = 'testing';
var should = require('should');
var Email = require('../../services/email');

describe('Testing email functions', function(){
   it('Should send and email', function(done){
       Email.sendMail("hello World", "juanjardim@gmail.com", "testing mail", function(err, info){
           should.not.exist(err);
           done();
       });
   });
});