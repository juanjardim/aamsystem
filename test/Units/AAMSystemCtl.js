'use strict';
process.env.NODE_ENV = 'testing';
var should = require('should');
var mongoose = require('mongoose');
var config = require('../../configs/config');
require('../../configs/mongoose')(config);

var SystemCtl = require('../../controllers/AAMSystemCtl');

describe('Testing AAMSystem Controller', function(){
    before(function(done){
        if(mongoose.connection.db){
            return done();
        }
        mongoose.connect(config.mongoURI, done);
    });

    it('isSystemConfigured return false when is not configured', function(done){
        SystemCtl.isSystemConfigured().then(function(isConfigured){
            isConfigured.should.be.eql(false);
            done();
        }, function(done){
            should.not.exist(err);
            done();
        });
    });

    it('Configure a new System', function(done){
        SystemCtl.configure().then(function(msg){
            should.exist(msg);
            msg.should.be.eql('System configured');
            done();
        }, function(err){
            should.not.exist(err);
            done();
        });
    });

    it('isSystemConfigured return true when is configured', function(done){
        SystemCtl.isSystemConfigured().then(function(isConfigured){
            isConfigured.should.be.eql(true);
            done();
        }, function(done){
            should.not.exist(err);
            done();
        });
    });

    it('Cannot configure the AAM System is already configured', function(done){
        SystemCtl.configure().then(function(msg){
            should.not.exist(msg);
            done();
        }, function(err){
            should.exist(err);
            err.should.be.eql('System already configured');
            done();
        });
    });
    it('Edit stored fields for user information', function(done){
        var fields = ['First Name', 'Last Name'];
        SystemCtl.editFields(fields).then(function(fields){
            should.exist(fields);
            fields.should.have.length(2);
            done();
        }, function(err){
            should.not.exist(err);
            done();
        });
    });

    it('Get all the system fields', function(done){
        SystemCtl.getFields().then(function(fields){
            should.exist(fields);
            fields.should.have.length(2);
            done();
        }, function(err){
            should.not.exist(err);
            done();
        });
    });

    after(function(done){
        mongoose.connection.db.dropDatabase(done);
    })
});