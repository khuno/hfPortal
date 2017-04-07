import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import '../api/cits.js';

import 'react-select/dist/react-select.css';

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

const TabsDev = {
    addTab : 0,
    listTab : 1
}

export default class DevView extends Component {

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
          selectedMails: listMails,
          additionalMails: "",
          selectedVersions: []
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

 handleAddVersions(val) {
     //console.log("Selected: " + val);
     this.setState({ selectedVersions: val });
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
   arrayVersions = this.state.selectedVersions;
   console.log(arrayVersions);
   //foreach version separated CIT
   let selectedMails = this.state.selectedMails.map(function(mail){return mail.value}).join();
   for (i = 0; i < arrayVersions.length; i++)
   {
     var submitedCIT = {
       issueNo:     this.state.issueNo,
       priority:    this.props.priority,
       description: this.props.description,
       ticketNo:    this.state.ticketNo,
       comment:     this.state.comment,
       deactivable: this.state.deactivable,
       version:     arrayVersions[i].version,
       product:     arrayVersions[i].product,
       components:  this.state.selectedComponents,
       mailsTo:     selectedMails +(this.state.additionalMails===""? "" : (","+ this.state.additionalMails)),

     }

     console.log(submitedCIT);
     //for now without validation
     Meteor.call('cits.insert', submitedCIT);
   }

   //CITs.insert(submitedCIT);

   this.setState(this.initializeState());

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
         <label htmlFor="componentsList">Versions</label>
           <Select
             name="form-field-name"
             value={this.state.selectedVersions}
             options={this.props.listVersions}
             onChange={val => this.handleAddVersions(val)}
             multi
             placeholder="Select versions..."
             backspaceToRemoveMessage=''
           />
       </div>
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
     <div className="jumbotron"> {JSON.stringify(this.props.myCITs)} </div>
   )
 }

 render() {
   return (
     <div>
       {this.renderTabs()}
       {this.state.activeTab == TabsDev.addTab ? this.renderAddTab() : this.renderListTab()}
     </div>
   )
 }

};
