import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import {versions} from './versions.js';
import {statuses} from './statuses.js';
import {hfs} from './hfs.js';

Meteor.methods({
  'test.setTestResult'(citId, testResult, hfId) {
    check(citId, String);
    check(testResult, String);
    check(hfId, String);

    if(! this.userId) {
      console.log(this.userId);
      throw new Meteor.Error('not-authorized');
    }
    if(! Roles.userIsInRole(this.userId, ['gvs', 'tester'])) {
      throw new Meteor.Error('not-permitted');
    }

    console.log(citId);
    console.log(testResult);
    console.log(hfId);
    Meteor.call('cits.setTest', citId, testResult);
    let hf = hfs.findOne(hfId);
    if (hf.status === "produced")
      Meteor.call('hfs.setStatus', hf, "start_test");
  }
});
