'use strict';
process.env.NODE_ENV = 'testing';
var should = require('should');
var mongoose = require('mongoose');
var config = require('../../configs/config');
require('../../configs/mongoose')(config);

var AppCtl = require('../../controllers/ApplicationCtl');

describe('Testing Application Controller', function(){
    var newApplication = {
        name: 'My New App',
        description: 'This is an app',
        dns: 'myApp.com'
    };
    var createdApp;
    before(function(done){
        if(mongoose.connection.db){
            return done();
        }
        mongoose.connect(config.mongoURI, done);
    });

    it('Create a new Applications', function(done){
        AppCtl.createApplication(newApplication.name, newApplication.description, newApplication.dns).then(function(application){
            should.exist(application);
            createdApp = application;
            application.name.should.be.eql(newApplication.name);
            done();
        }, function(err){
            should.not.exist(err);
            done();
        });
    });

    it('Get all Applications', function(done){
        AppCtl.getAllApplication().then(function(applications){
            should.exist(applications);
            applications.should.have.length(1);
            done();
        }, function(err){
            should.not.exit(err);
            done();
        });
    });

    it('Get Application By Id', function(done){
        AppCtl.getApplicationById(createdApp._id).then(function(application){
            should.exist(application);
            application._id.should.be.eql(application._id);
            done();
        }, function(err){
            should.not.exist(err);
            done();
        });
    });

    it('Cannot get application when the id is null', function(done) {
        AppCtl.getApplicationById(null).then(function (application) {
            should.not.exist(application);
            done();
        }, function (err) {
            should.exist(err);
            err.should.eql('Application ID cannot be null');
            done();
        });
    });

    it('Get Application By Name', function(done){
        AppCtl.getApplicationByName(newApplication.name).then(function(application){
            should.exist(application);
            application._id.should.be.eql(createdApp._id);
            done();
        }, function(err){
            should.not.exist(err);
            done();

        });
    });

    it('Change status of Applications to INACTIVE', function(done){
        AppCtl.changeApplicationStatus(createdApp._id, 'INACTIVE').then(function(application){
            should.exist(application);
            application.status.should.be.equal('INACTIVE');
            done();
        }, function(err){
            should.not.exist(err);
            done();
        });
    });

    after(function(done){
        mongoose.connection.db.dropDatabase(done);
    });
});