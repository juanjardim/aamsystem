'use strict';
process.env.NODE_ENV = 'testing';
var should = require('should');
var mongoose = require('mongoose');
var config = require('../../configs/config');
require('../../configs/mongoose')(config);

var GroupCtl = require('../../controllers/GroupCtl');

describe('Testing Group Controller', function () {
    before(function (done) {
        if (mongoose.connection.db)
            return done();
        mongoose.connect(config.mongoURI, done);
    });

    var group = {
        name: 'My new Group',
        description: 'this is a test'
    };
    var createdGroup;

    it('Create a new group', function (done) {
        GroupCtl.createGroup(group.name, group.description).then(function (group) {
            should.exist(group);
            createdGroup = group;
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('Cannot Create a new group with the same name', function (done) {
        GroupCtl.createGroup(group.name, group.description).then(function (group) {
            should.not.exist(group);
            done();
        }, function (err) {
            should.exist(err);
            err.should.be.equal('Group already exist');
            done();
        })
    });

    it('Get an existing group by id', function (done) {
        GroupCtl.getGroupById(createdGroup._id).then(function (group) {
            should.exist(group);
            createdGroup._id.should.be.eql(group._id);
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('Get an existing group by name', function (done) {
        GroupCtl.getGroupByName(createdGroup.name).then(function (group) {
            should.exist(group);
            createdGroup._id.should.be.eql(group._id);
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('Get all Groups', function (done) {
        GroupCtl.getAllGroups().then(function (groups) {
            should.exist(groups);
            groups.should.have.length(1);
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('Change status by Id to INACTIVE', function (done) {
        GroupCtl.changeGroupStatus(createdGroup._id, "INACTIVE").then(function (group) {
            should.exist(group);
            group.status.should.be.eql("INACTIVE");
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });

    describe('Operations for permissions', function () {
        it('Add permissions');
        it('Remove permissions');
        it('Add permission cluster');
        it('Remove permission cluster');
    });


    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            //if (mongoose.connection.db) {
            //    mongoose.connection.close(done);
            //}
            //else {
            //    done();
            //}
            done();
        });
    });
});