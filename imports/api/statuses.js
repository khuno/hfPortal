import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

export const statuses = new Mongo.Collection('statuses');

Meteor.methods({
  'statuses.insert'(obj)
  {
    check(obj, Object);
    if(! this.userId) {
      console.log(this.userId);
      throw new Meteor.Error('not-authorized');
    }
    if(! Roles.userIsInRole(this.userId, ['production'])) {
      throw new Meteor.Error('not-permitted');
    }
    statuses.insert({
      value: obj.value,
      label: obj.label,
      nextStatuses: obj.nextStatuses,
    });
  }
});
