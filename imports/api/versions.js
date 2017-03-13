import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const versions = new Mongo.Collection('versions');

Meteor.methods({
  'versions.insert'(obj)
  {
    check(obj, Object);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    versions.insert({
      value: obj.value,
      label: obj.label
    });
  }
});
