import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

export const cits = new Mongo.Collection('cits');

Meteor.methods({
  'cits.insert'(obj)
  {
    check(obj, Object);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

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
      owner: this.userId,
      email: Meteor.users.findOne(this.userId).emails[0].address,
    });
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
  }

});
