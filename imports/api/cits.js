import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Email } from 'meteor/email';

export const cits = new Mongo.Collection('cits');

Meteor.methods({
  'cits.insert'(obj)
  {
    check(obj, Object);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let highestCIT = cits.find({},{limit: 1,sort: {citNo:-1}}).fetch();
    let newCITNo = (highestCIT[0]? (highestCIT[0].citNo + 1) : 1);

    cits.insert({
      issueNo:     obj.issueNo,
      priority:    obj.priority,
      description: obj.description,
      ticketNo:    obj.ticketNo,
      comment:     obj.comment,
      deactivable: obj.deactivable,
      version:     obj.version,
      product:     obj.product,
      components:  obj.components,
      mailsTo:     obj.mailsTo,
      createdAt: new Date(),
      citNo: newCITNo,
      owner: this.userId,
      email: Meteor.users.findOne(this.userId).emails[0].address,
    });
    if (Meteor.isServer) {
      let txt = "CIT summary: \nIssue number:"+obj.issueNo;
      let sbj = "New CIT was submitted (CIT-"+newCITNo+")";
      //console.log(Email);
      Email.send({
        to: "Sergii Khunovych <sergii.khunovych@ixperta.com>",
        from: "<4km-hfportal@unify.com>",
        subject: sbj,
        text: txt
      });
    }
  },

  'cits.addToHF'(id, hfId)
  {
    check(id, String);
    check(hfId, String);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    if(! Roles.userIsInRole(this.userId, ['production'])) {
      throw new Meteor.Error('not-permitted');
    }

    cits.update(id, {$set: {"hfId": hfId}});
  },

  'cits.setTest'(id, testResult)
  {
    check(id, String);
    check(testResult, String);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    if(! Roles.userIsInRole(this.userId, ['gvs', 'tester', 'admin'])) {
      throw new Meteor.Error('not-permitted');
    }

    cits.update(id, {$set: {"test": testResult, "testedBy": Meteor.users.findOne(this.userId).emails[0].address}});
  }

});
