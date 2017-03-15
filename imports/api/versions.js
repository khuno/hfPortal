import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

export const versions = new Mongo.Collection('versions');

Meteor.methods({
  'versions.insert'(obj)
  {
    check(obj, Object);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    if(! Roles.userIsInRole(this.userId, ['production'])) {
      throw new Meteor.Error('not-permitted');
    }
    versions.insert({
      value: obj.value,
      label: obj.label
    });
  }
});
