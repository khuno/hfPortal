import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Select from 'react-select';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Roles } from 'meteor/alanning:roles';
import { CITs } from '../api/cits.js'


var listComponents = [
    { value: 'swt', label: 'ASswt' },
    { value: 'swa', label: 'ASswa' },
    { value: 'fm', label: 'ASfm' },
    { value: 'logm', label: 'ASlogm' },
    { value: 'hg3550m', label: 'AShg3550m' },
    { value: 'ipsm', label: 'ASipsm' }
];

var listMails = [
    { value: 'development', label: 'Development' },
    { value: 'gvs', label: 'GVS' },
    { value: 'management', label: 'Management' },
    { value: 'production', label: 'Production' }
];

var listAdditMails = [];


// App component - represents the whole app
class App extends Component {

  constructor() {
      super();
      this.state = this.initializeState();
    }

  initializeState() {
    var initState = {
          activeTab: TabsDev.addTab,
          issueNo: "",
          selectedComponents: "",
          deactivable: true,
          ticketNo: "",
          comment: "",
          selectedMails: "",
          additionalMails: "",
        }
    return initState;
  }

  componentWillReceiveProps(nextProps){

  }

  onTabSelected(ev, selectedTab) {
          this.setState({ activeTab: selectedTab });
      }

 onIssueNoChange(ev) {
   this.setState({issueNo: ev.target.value});
 }

 onticketNoChange(ev) {
   this.setState({ticketNo: ev.target.value});
 }

 onCommentChange(ev) {
   //console.log(ev);
   this.setState({comment: ev.target.value});
 }

 onDeactivChange(ev) {
   console.log(ev.target);
   this.setState({deactivable: ev.target.checked})
 }

 handleAddComponents(val) {
     //console.log("Selected: " + val);
     this.setState({ selectedComponents: val });
 }

 handleAddMailLists(val) {
   this.setState({ selectedMails: val });
 }

 handleAddAdditionalMail(val) {
   this.setState({ additionalMails: val })
 }

 handleSubmit(ev) {
   event.preventDefault();
   //console.log(this.props);

   var submitedCIT = {
     issueNo:     this.state.issueNo,
     priority:    this.props.priority,
     description: this.props.description,
     ticketNo:    this.state.ticketNo,
     comment:     this.state.comment,
     deactivable: this.state.deactivable,
     components:  this.state.selectedComponents,
     mailsTo:     this.state.selectedMails +(this.state.additionalMails===""? "" : (","+ this.state.additionalMails)),

   }

   console.log(submitedCIT);
   //for now without validation
   Meteor.call('cits.insert', submitedCIT);
   //CITs.insert(submitedCIT);

   this.setState(this.initializeState());

 }

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

  renderIssueSpec() {
    return (
      <div className="row">
        <div className="form-group">
          <label htmlFor="issueNo">Issue/MR number</label>
          <input type="issue" className="form-control" id="issueNo" value={this.state.issueNo} onChange={ev => this.onIssueNoChange(ev)} placeholder="MR/OSFOUR..." />
        </div>
        <div className="form-group">
          <label htmlFor="prior">Priority</label>
          <input type="priority" className="form-control" id="priority" value={this.props.priority} placeholder="P4" readOnly />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="Description" className="form-control" value={this.props.description} rows="8" cols="40" readOnly></textarea>
        </div>
      </div>
    )
  }

  renderProductSpec() {
    return (
      <div className="row">
        <div className="form-group">
          <label htmlFor="componentsList">Components</label>
            <Select
              name="form-field-name"
              value={this.state.selectedComponents}
              options={listComponents}
              onChange={val => this.handleAddComponents(val)}
              multi
              simpleValue
              placeholder="Select components..."
              backspaceToRemoveMessage=''
            />
          <input type="multiSelectInput" className="form-control" id="componentsList"
                            value={this.state.selectedComponents} placeholder="AS..." />
        </div>
        <div className="form-group">
          <label htmlFor="ticketNo">GVS ticket number</label>
          <input type="ticket" className="form-control" id="ticketNo" value={this.state.ticketNo} onChange={ev => this.onticketNoChange(ev)} placeholder="NA..." />
        </div>
        <div className="form-group">
          <label>Comment</label>
          <textarea name="Comment" className="form-control" value={this.state.comment} onChange={ev => this.onCommentChange(ev)} rows="8" cols="40"></textarea>
        </div>
        <div className="checkbox">
          <label>
            <input type="checkbox" checked={this.state.deactivable} onChange={ev => this.onDeactivChange(ev)}/> Deactivable
          </label>
        </div>
      </div>
    )
  }

  renderMailList() {
    return (
      <div className="row">
        <div className="form-group">
          <label htmlFor="mailList">Will be sent to</label>
            <Select
              name="form-field-name"
              value={this.state.selectedMails}
              options={listMails}
              onChange={val => this.handleAddMailLists(val)}
              multi

              simpleValue
              placeholder="Select mail lists..."
              backspaceToRemoveMessage=''
            />
          <input type="mailList" className="form-control" id="mailLIst" value={this.state.selectedMails} />
        </div>

        <div className="form-group">
          <label htmlFor="additionalMail">Additional</label>
          <Select.Creatable
            name="form-field-name"
            options={listAdditMails}
            value={this.state.additionalMails}
            onChange={val => this.handleAddAdditionalMail(val)}
            multi
            simpleValue
            placeholder="Enter additional mails..."
            backspaceToRemoveMessage=''
            noResultsText=''
          />
          <input type="email" className="form-control" id="additionalMail" value={this.state.additionalMails} placeholder="unify@unify.com" />
        </div>
      </div>
    )
  }

  renderTabs() {
      return <ul className="nav nav-tabs tab">
              <li className={(this.state.activeTab == TabsDev.addTab ? "active" : "")}>
                <a href="javascript:void(0)"  onClick={ev => this.onTabSelected(ev, TabsDev.addTab)}>Add CIT</a></li>
              <li className={(this.state.activeTab == TabsDev.listTab ? "active" : "")}>
                <a href="javascript:void(0)" onClick={ev => this.onTabSelected(ev, TabsDev.listTab)}>List CITs</a></li>
            </ul>;
  }

  renderAddTab() {
    return (
      <div className="jumbotron">
        <h3>Add CIT</h3>
        {this.renderIssueSpec()}
        {this.renderProductSpec()}
        {this.renderMailList()}
        <button type="submit" className="btn btn-default" onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>
    )
  }

  /*renderDeveloperUser() {
    return (
      {this.renderTabs()}
      this.state.activeTab == TabsDev.addTab ? this.renderAddTab() : this.renderListTab();
    )
  }*/

  renderListTab() {
    return (
      <div className="jumbotron"> </div>
    )
  }
/*PRODUCTION*/

  productionView()
  {
    return (
      <div>
       <ul className="nav nav-tabs tab">
         <li className="active"><a data-toggle="tab" href="#hfList">HF List</a></li>
         <li><a data-toggle="tab" href="#citList">List of all CITs</a></li>
       </ul>

       <div className="jumbotron" id="hfList">
         <div className="row">
           <button type="button" className="btn btn-default">
             Define new HF
           </button>
            <div className="btn-group">
              <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Change status <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                <li><a href="#">Requested</a></li>
                <li><a href="#">Produced</a></li>
                <li><a href="#">Started up/In test</a></li>
                <li><a href="#">Reproduction requested</a></li>
                <li><a href="#">Tested</a></li>
                <li><a href="#">Released</a></li>
              </ul>
            </div>
         </div>
         <table className="table">
           <thead>
             <tr>
               <th></th>
               <th></th>
               <th>HF number</th>
               <th>Product</th>
               <th>Version</th>
               <th>Status</th>
               <th>Last modify</th>
             </tr>
             <tr>
               <th><input type="checkbox" /></th>
               <th></th>
               <th><input type="text"/></th>
               <th><input type="text"/></th>
               <th><input type="text"/></th>
               <th><input type="text"/></th>
               <th><input type="text"/></th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td><input type="checkbox" /></td>
               <td><span className="glyphicon glyphicon-plus"></span></td>
               <td>HF 1</td>
               <td>Assistant</td>
               <td>V7 R2.0</td>
               <td>Released</td>
               <td>20.12.2016</td>
             </tr>
             <tr>
               <td><input type="checkbox" /></td>
               <td><span className="glyphicon glyphicon-plus"></span></td>
               <td>HF 1</td>
               <td>Manager</td>
               <td>V7 R2.0</td>
               <td>Produced</td>
               <td>20.12.2016</td>
             </tr>
           </tbody>
         </table>
       </div>

     </div>
    )
  }

/*END PRODUCTION*/

render() {
    return (
      <div className="container">
          {this.renderHeader()}
          {(this.props.currentUser && Roles.userIsInRole(this.props.currentUser._id, ['developer'])) ? this.renderTabs() : null}
          {(this.props.currentUser && Roles.userIsInRole(this.props.currentUser._id, ['developer'])) ? (this.state.activeTab == TabsDev.addTab ? this.renderAddTab() : this.renderListTab()) : null}
          {(this.props.currentUser && Roles.userIsInRole(this.props.currentUser._id, ['production'])) ? this.productionView() : null}
        </div>
      );
  }
}


const TabsDev = {
    addTab : 0,
    listTab : 1
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
