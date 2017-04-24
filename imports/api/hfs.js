import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import {versions} from './versions.js';
import {statuses} from './statuses.js';

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
    if (Meteor.isServer) {
      let sbj = "New HF was defined(HF "+newHfNumber+" "+ver.label+")";
      let txt = "Hello all,\n"+sbj;
      //console.log(Email);
      Email.send({
        to: "Sergii Khunovych <sergii.khunovych@ixperta.com>",
        from: "<4km-hfportal@unify.com>",
        subject: sbj,
        text: txt
      });
    }
  },

  'hfs.setStatus'(hf, newStatus)
  {
    check(hf, Object);
    check(newStatus, String);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    if(! Roles.userIsInRole(this.userId, ['production', 'gvs', 'tester'])) {
      throw new Meteor.Error('not-permitted');
    }

    hfs.update(hf._id, { $set: {status: newStatus, modifiedAt: new Date()}});

    if (Meteor.isServer) {
      let version = versions.findOne({product: hf.product, version: hf.version});
      let status = statuses.findOne({value: newStatus});
      let sbj = "HF status changed";
      let txt = "Hello all,\n"+"Status of HF "+hf.hfNumber+" "+version.label+" changed to "+status.label+".";
      //console.log(Email);
      Email.send({
        to: "Sergii Khunovych <sergii.khunovych@ixperta.com>",
        from: "<4km-hfportal@unify.com>",
        subject: sbj,
        text: txt
      });
    }
  },

  'hfs.deleteHF'(hf)
  {
    check(hf, Object);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    if(! Roles.userIsInRole(this.userId, ['production'])) {
      throw new Meteor.Error('not-permitted');
    }

    let highestHF = hfs.find({version: ver.version, product: ver.product},{limit: 1,sort: {hfNumber:-1}}).fetch();
    if(highestHF === hf.hfNumber)
    {
      console.log("we can delete");
    }
    else {
      console.log("NO");
    }
  }
});
