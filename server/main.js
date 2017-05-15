import { Roles } from 'meteor/alanning:roles';
import '../imports/api/cits.js';
import '../imports/api/hfs.js';
import '../imports/api/jira.js';
import '../imports/api/test.js';
import '../imports/api/mail_notification.js';
import {versions} from '../imports/api/versions.js';
import {statuses} from '../imports/api/statuses.js';
import {components} from '../imports/api/components.js';
import {mail_list} from '../imports/api/mail_list.js';

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

  //initial creating of components collection
  if (components.find().count() === 0) {
    JSON.parse(Assets.getText('components.json')).forEach(function (component) {
      components.insert(component);
      //Meteor.call('statuses.insert', status);
    });
  }

  //initial creating of mail_list collection
  if (mail_list.find().count() === 0) {
    JSON.parse(Assets.getText('mail_list.json')).forEach(function (mail) {
      mail_list.insert(mail);
      //Meteor.call('statuses.insert', status);
    });
  }

});
