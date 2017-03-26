import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import DevView from './devView.jsx';
import ProdView from './prodView.jsx';
import { Roles } from 'meteor/alanning:roles';
import { cits } from '../api/cits.js';
import { versions } from '../api/versions.js';
import { hfs } from '../api/hfs.js';
import { statuses } from '../api/statuses.js';






// App component - represents the whole app
class App extends Component {

  renderHeader() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Unify - Hotfix Portal</a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#"><span className="glyphicon glyphicon-cog"></span> Settings</a></li>
            <li><AccountsUIWrapper /></li>
          </ul>
        </div>
      </nav>
    )
  }

render() {
    return (
      <div className="container">
          {this.renderHeader()}
          {(this.props.currentUser && Roles.userIsInRole(this.props.currentUser._id, ['developer'])) ? <DevView myCITs={this.props.cits} listVersions={this.props.listVersions} /> : null}
          {(this.props.currentUser && Roles.userIsInRole(this.props.currentUser._id, ['production'])) ?
              <ProdView listCITs={this.props.cits} listVersions={this.props.listVersions} listHFs={this.props.listHFs}
                        arrVersions={_.keys(_.countBy(this.props.listVersions, function(ver){ return ver.version; }))}
                        listStatuses={this.props.listStatuses}/> : null}
        </div>
      );
  }
}

// App.propTypes = {
//   tasks: PropTypes.array.isRequired,
// };

export default createContainer(({params}) => {
  const currentUser = Meteor.user();

  if (currentUser && Roles.userIsInRole(currentUser._id, ['developer']))
  {
    return {
      priority: "P4",
      description: "asd",
      currentUser,
      cits: cits.find({owner: currentUser._id}).fetch(),
      listVersions: versions.find({}).fetch()
    }
  }
  else if (currentUser && Roles.userIsInRole(currentUser._id, ['production']))
  {
    return {
      currentUser,
      cits: cits.find({}).fetch(),
      listVersions: versions.find({}).fetch(),
      listHFs: hfs.find({}).fetch(),
      listStatuses: statuses.find({}).fetch()
    }
  }
  else if (currentUser && Roles.userIsInRole(currentUser._id, ['gvs']))
  {
    return {
      currentUser
    }
  }
  else {
    return {
      currentUser
    }
  }

}, App);
