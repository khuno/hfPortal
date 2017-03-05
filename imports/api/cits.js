import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const CITs = new Mongo.Collection('CITs');

Meteor.methods({
  'cits.insert'(obj)
  {
    check(obj, Object);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    CITs.insert({
      issueNo:     obj.issueNo,
      priority:    obj.priority,
      description: obj.description,
      ticketNo:    obj.ticketNo,
      comment:     obj.comment,
      deactivable: obj.deactivable,
      components:  obj.components,
      mailsTo:     obj.mailsTo,
      createdAt: new Date(),
      owner: this.userId,
      email: Meteor.users.findOne(this.userId).emails[0].address,
    });
  }
});
