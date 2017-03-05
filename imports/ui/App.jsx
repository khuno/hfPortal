import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import DevView from './devView.jsx';
import ProdView from './prodView.jsx';
import { Roles } from 'meteor/alanning:roles';






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
          {(this.props.currentUser && Roles.userIsInRole(this.props.currentUser._id, ['developer'])) ? <DevView /> : null}
          {(this.props.currentUser && Roles.userIsInRole(this.props.currentUser._id, ['production'])) ? <ProdView /> : null}
        </div>
      );
  }
}

App.propTypes = {
  //tasks: PropTypes.array.isRequired,
};

export default createContainer(({params}) => {
  return {
    priority: "P4",
    description: "asd",
    currentUser: Meteor.user(),
    //tasks: Tasks.find({}).fetch(),
  };
}, App);
