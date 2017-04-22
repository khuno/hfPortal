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

class CitRow extends Component {
  render() {
    let version = _.findWhere(this.props.listVersions, {version: this.props.cit.version, product: this.props.cit.product});
    return (
      <tr>
        <td><span className="glyphicon glyphicon-plus"></span></td>
        <td>CIT-{this.props.cit.citNo}</td>
        <td>{version.label}</td>
        <td>{this.props.cit.components}</td>
        <td>{this.props.cit.email}</td>
        <td>{this.props.cit.createdAt.toLocaleString()}</td>
        <td>{this.props.cit.description}</td>
      </tr>
    )
  }
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
          selectedVersions: [],
          description: "",
          priority: ""
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

 onIssueNoBlur(ev) {
   let _response = Meteor.call('jira.getIssue', ev.target.value, {returnStubValue: true}, function(err, response){
     if(err) {
       console.log(err);
     }
     else {
       console.log(response);
       this.setState(response);
     }
   }.bind(this));
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
         <label htmlFor="issueNo">Issue number</label>
         <input type="issue" className="form-control" id="issueNo" value={this.state.issueNo} onChange={ev => this.onIssueNoChange(ev)} onBlur={ev => this.onIssueNoBlur(ev)} placeholder="OSFOURK-..." />
       </div>
       <div className="form-group">
         <label htmlFor="prior">Priority</label>
         <input type="priority" className="form-control" id="priority" value={this.state.priority} placeholder="P4"  />
       </div>
       <div className="form-group">
         <label>Description</label>
         <textarea name="Description" className="form-control" value={this.state.description} rows="2" cols="40" ></textarea>
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
               <a href="javascript:void(0)" onClick={ev => this.onTabSelected(ev, TabsDev.listTab)}>My CITs</a></li>
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

 renderCITsByHF() {
   var toReturn = [];
   //process unassigned CITs
   {
     let tmpCits = _.where(this.props.myCITs, {hfId: undefined});

     let key = new Date();

     // console.log(tmpCits);

     if (tmpCits.length !== 0) {
       toReturn = _.union(toReturn,[
         <tr key={key.getTime()+Math.random()}><th colSpan="8">Unassigned</th></tr>,
         ...tmpCits.map((cit) => {
               return <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} />
           })
       ]);
     }
   }

   //process assigned CITs by HF
   {

     let arrHfs = _.sortBy(this.props.listHFs, function(o){ return -o.modifiedAt;});
     for (let hf of arrHfs) {
       let tmpCits = _.where(this.props.myCITs, {hfId: hf._id});
       let key = new Date();

       if (tmpCits.length !== 0) {
         let version = _.findWhere(this.props.listVersions, {version: hf.version, product: hf.product});
         let label = "HF "+hf.hfNumber+" "+version.label;
         toReturn = _.union(toReturn,[
           <tr key={key.getTime()+Math.random()}><th colSpan="8">{label}</th></tr>,
           ...tmpCits.map((cit) => <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions}/>)
         ]);
       }
     }
   }

   return toReturn;
 }

 renderListTab() {
   return (
     <div className="container">
       <table className="table table-hover">
         <thead>
           <tr>
             <th></th>
             <th>CIT number</th>
             <th>Product</th>
             <th>Components</th>
             <th>Submitted by</th>
             <th>Submitted date</th>
             <th>Description</th>
             <th></th>
           </tr>
           <tr>
             <th></th>
             <th></th>
             <th><input type="text"/></th>
             <th><input type="text"/></th>
             <th><input type="text"/></th>
             <th><input type="text"/></th>
             <th><input type="text"/></th>
           </tr>
         </thead>
         <tbody>
           {this.renderCITsByHF()}
         </tbody>
       </table>
     </div>
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
