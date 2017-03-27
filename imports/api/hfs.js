import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

export const hfs = new Mongo.Collection('hfs');

Meteor.methods({
  'hfs.insert'(ver)
  {
    check(ver, Object);
    //console.log(ver);
    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    if(! Roles.userIsInRole(this.userId, ['production'])) {
      throw new Meteor.Error('not-permitted');
    }

    let highestHF = hfs.find({version: ver.version, product: ver.product},{limit: 1,sort: {hfNumber:-1}}).fetch();
    //console.log(highestHF);
    let newHfNumber = (highestHF[0]? (highestHF[0].hfNumber + 1) : 1);

    //console.log(ver);

    hfs.insert({
      version: ver.version,
      product: ver.product,
      modifiedAt: new Date(),
      status: "defined",
      hfNumber: newHfNumber
    });
  },

  'hfs.setStatus'(id, newStatus)
  {
    check(id, String);
    check(newStatus, String);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    if(! Roles.userIsInRole(this.userId, ['production'])) {
      throw new Meteor.Error('not-permitted');
    }

    hfs.update(id, { $set: {status: newStatus, modifiedAt: new Date()}});

  }
});
