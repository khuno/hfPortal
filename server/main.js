import { Roles } from 'meteor/alanning:roles';
import '../imports/api/cits.js';

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
