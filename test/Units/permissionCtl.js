'use strict';
process.env.NODE_ENV = 'testing';
var should = require('should');
var mongoose = require('mongoose');
var config = require('../../configs/mongoose')(config);
var sinon = require('sinon');

var PermissionCtl = require('../../controllers/PermissionCtl');

describe('Testing Permission Controller', function () {
    before(function (done) {
        if (mongoose.connection.db)
            return done();
        mongoose.connect(config.mongoURI, done);
    });
    var applicationId = mongoose.Types.ObjectId();
    var createdPermission = {
        name: 'FirstPermission',
        description: 'This is the first permission created',
        application: applicationId
    };

    it('Create a new Permission', function (done) {
        PermissionCtl.createPermission(createdPermission.name, createdPermission.description, createdPermission.application).then(function (permission) {
            should.exist(permission);
            permission.name.should.be.equal(permission.name);
            createdPermission = permission;
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });
    it('Cannot Create a new Permission with the same name', function (done) {
        PermissionCtl.createPermission(createdPermission.name, createdPermission.description, createdPermission.application).then(function (permission) {
            should.not.exist(permission);
            done();
        }, function (err) {
            should.exist(err);
            err.should.be.equal('Permission already exist');
            done();
        });
    });
    it('Get a permission by ID', function (done) {
        PermissionCtl.getPermissionById(createdPermission._id).then(function (permission) {
            should.exist(permission);
            permission._id.should.be.eql(createdPermission._id);
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });
    it('Get a permission by Name', function (done) {
        PermissionCtl.getPermissionByName(createdPermission.name).then(function (permission) {
            should.exist(permission);
            permission._id.should.be.eql(createdPermission._id);
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });
    it('Get all permissions', function (done) {
        PermissionCtl.getAllPermissions().then(function (permissions) {
            should.exist(permissions);
            permissions.should.have.length(1);
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });
    it('Change status by Id to INACTIVE', function (done) {
        PermissionCtl.changePermissionStatus(createdPermission._id, 'INACTIVE').then(function (permission) {
            should.exist(permission);
            permission.status.should.be.eql('INACTIVE');
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('Get permisions by ids', function (done) {
        PermissionCtl.getPermissionsById([createdPermission._id]).then(function (permissions) {
            should.exist(permissions);
            permissions.should.have.length(1);
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });



    it('Get All permissions that bellong to an application', function(done){
        PermissionCtl.getAllPermissionsByApplication(applicationId).then(function(permissions){
            should.exist(permissions);
            permissions.should.have.length(1);
            done();
        }, function(err){
            should.not.exist(err);
        });
    });


    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            //if(mongoose-connection.db){
            //    mongoose.connection.close(done);
            //} else {
            //    done();
            //}
            done();
        });
    });
});