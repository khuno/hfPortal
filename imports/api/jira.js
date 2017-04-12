import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
var JiraApi = require('jira-client');

var config = JSON.parse(Assets.getText('configJira.json'));

var jira = new JiraApi({
  protocol: config.protocol,
  host: config.host,
  port: config.port,
  username: config.user,
  password: config.password,
  apiVersion: config.apiVer,
  strictSSL: config.strictSSL
});

  Meteor.methods({
    'jira.getIssue'(issueKey)
    {
      check(issueKey, String);
      if(! this.userId) {
        console.log(this.userId);
        throw new Meteor.Error('not-authorized');
      }
      if(! Roles.userIsInRole(this.userId, ['developer'])) {
        throw new Meteor.Error('not-permitted');
      }

      Future = Npm.require('fibers/future');
      var future = new Future();

      jira.findIssue(issueKey)
        .then(function(issue) {
          console.log(issue.fields.summary);
          console.log(issue.fields.priority.name);
          // console.log(issue.fields.description);
          future["return"]({
            description: issue.fields.summary,
            priority: issue.fields.priority.name
          });
        })
        .catch(function(err) {
          console.error(err);
        });
        return future.wait();
    }
  });
