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
        host: 'myApp.com'
    };
    var createdApp;
    before(function(done){
        if(mongoose.connection.db){
            return done();
        }
        mongoose.connect(config.mongoURI, done);
    });

    it('Create a new Applications', function(done){
        AppCtl.createApplication(newApplication.name, newApplication.description, newApplication.host).then(function(application){
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
        AppCtl.getAllApplications().then(function(applications){
            should.exist(applications);
            applications.should.have.length(1);
            done();
        }, function(err){
            should.not.exit(err);
            done();
        });
    });

    it('Get all Applications By Ids', function(done){
        AppCtl.getAllApplicationsByIds([createdApp._id]).then(function(applications){
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

    it('Generate a new JWT Secret', function(done){
        AppCtl.generateNewJWTSecret(createdApp._id).then(function(jwtSecret){
            should.exist(jwtSecret);
            done();
        }, function(err){
            should.not.exist(err);
            done();
        });
    });

    it('Get the JWT Secret by application ID', function(done){
        AppCtl.getJWTSecret(createdApp._id).then(function(jwtSecret){
            should.exist(jwtSecret);
            done();
        }, function(err){
            should.not.exist(err);
            done();
        });
    });

    it('Change status of Applications to INACTIVE', function(done){
        AppCtl.changeApplicationStatus(createdApp._id, 'INACTIVE').then(function(application){
            should.exist(application);
            application.status.should.be.eql('INACTIVE');
            done();
        }, function(err){
            should.not.exist(err);
            done();
        });
    });

    it('Cannot generate a new JWT Secret when the application status != ACTIVE', function(done){
        AppCtl.generateNewJWTSecret(createdApp._id).then(function(jwtSecret){
            should.not.exist(jwtSecret);
            done();
        }, function(err){
            should.exist(err);
            err.should.be.eql('Cannot generate a new secret. Application is INACTIVE');
            done();
        });
    });

    it('Cannot get the JWT Secret by application ID when the application status != ACTIVE', function(done){
        AppCtl.getJWTSecret(createdApp._id).then(function(jwtSecret){
            should.not.exist(jwtSecret);
            done();
        }, function(err){
            should.exist(err);
            err.should.be.eql('Application is INACTIVE');
            done();
        });
    });

    after(function(done){
        mongoose.connection.db.dropDatabase(done);
    });
});