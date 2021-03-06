import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import DevView from './devView.jsx';
import ProdView from './prodView.jsx';
import TestView from './testView.jsx';
import { Roles } from 'meteor/alanning:roles';
import { cits } from '../api/cits.js';
import { versions } from '../api/versions.js';
import { hfs } from '../api/hfs.js';
import { statuses } from '../api/statuses.js';
import { components } from '../api/components.js';
import { mail_list } from '../api/mail_list.js';





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
      <div>
          {this.renderHeader()}
          {(this.props.currentUser && Roles.userIsInRole(this.props.currentUser._id, ['developer'])) ?
              <DevView listCITs={this.props.cits} listComponents={this.props.listComponents} listMails={this.props.listMails}
                       listVersions={this.props.listVersions} listHFs={this.props.listHFs}
                       arrVersions={_.keys(_.countBy(this.props.listVersions, function(ver){ return ver.version; }))}
                       listStatuses={this.props.listStatuses}/> : null}
          {(this.props.currentUser && Roles.userIsInRole(this.props.currentUser._id, ['gvs', 'tester'])) ?
              <TestView listCITs={this.props.cits} listVersions={this.props.listVersions} listHFs={this.props.listHFs}
                    arrVersions={_.keys(_.countBy(this.props.listVersions, function(ver){ return ver.version; }))}
                    listStatuses={this.props.listStatuses}/> : null}
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
      currentUser,
      cits: cits.find({}, {sort: {date_created: -1}}).fetch(),
      cits: cits.find({}, {sort: {date_created: -1}}).fetch(),
      listHFs: hfs.find({}, {sort: {date_created: -1}}).fetch(),
      listVersions: versions.find({}).fetch(),
      listComponents: components.find({}).fetch(),
      listMails: mail_list.find({}).fetch(),
      listStatuses: statuses.find({}).fetch()
    }
  }
  else if (currentUser && Roles.userIsInRole(currentUser._id, ['production','gvs']))
  {
    return {
      currentUser,
      cits: cits.find({}, {sort: {date_created: -1}}).fetch(),
      listVersions: versions.find({}).fetch(),
      listHFs: hfs.find({}, {sort: {date_created: -1}}).fetch(),
      listStatuses: statuses.find({}).fetch()
    }
  }
  // else if (currentUser && Roles.userIsInRole(currentUser._id, ['gvs']))
  // {
  //   return {
  //     currentUser
  //   }
  // }
  else {
    return {
      currentUser
    }
  }

}, App);
