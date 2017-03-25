import { Roles } from 'meteor/alanning:roles';
import '../imports/api/cits.js';
import '../imports/api/hfs.js';
import {versions} from '../imports/api/versions.js';
import {statuses} from '../imports/api/statuses.js';

Meteor.startup(function () {
  //initial creating of versions collection
  if (versions.find().count() === 0) {
    JSON.parse(Assets.getText('versions.json')).forEach(function (version) {
      versions.insert(version);
      //Meteor.call('versions.insert', version);
    });
  }

  //initial creating of users
  if (Meteor.users.find().count() === 0) {
    JSON.parse(Assets.getText('users_init.json')).forEach(function (user) {
      var id;

      id = Accounts.createUser({
        email: user.email,
        password: "apple1",
        profile: { name: user.name }
      });

      if (user.roles.length > 0) {
        // Need _id of existing user record so this call must come
        // after `Accounts.createUser` or `Accounts.onCreate`
        Roles.addUsersToRoles(id, user.roles);
      }
    });
  }

  //initial creating of statuses collection
  if (statuses.find().count() === 0) {
    JSON.parse(Assets.getText('statuses.json')).forEach(function (status) {
      statuses.insert(status);
      //Meteor.call('statuses.insert', status);
    });
  }

});
