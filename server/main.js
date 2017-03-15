import { Roles } from 'meteor/alanning:roles';
import '../imports/api/cits.js';
import '../imports/api/hfs.js'
import versions from '../imports/api/versions.js'
/*
var users = [
      {name:"sergii",email:"sergii@ixperta.com",roles:['developer']},
      {name:"franta",email:"franta@ixperta.com",roles:['developer']},
      {name:"alina",email:"alina@unify.com",roles:['gvs']},
      {name:"stefan",email:"stefan@unify.com",roles:['production', 'admin']},
    ];

    _.each(users, function (user) {
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
*/


/*var list = [
  { value: 'assistant_V8_0.1', label: 'Assistant V8 0.1' },
  { value: 'manager_V8_0.1', label: 'Manager V8 0.1' },
  { value: 'assistant_V8_1.5', label: 'Assistant V8 1.5' },
  { value: 'manager_V8_1.5', label: 'Manager V8 1.5' }
]

_.each(list, function(version){
  Meteor.call('versions.insert', version);
});*/
