import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import '../api/cits.js';

import 'react-select/dist/react-select.css';


var listMails = [
    { value: 'development', label: 'Development' },
    { value: 'gvs', label: 'GVS' },
    { value: 'management', label: 'Management' },
    { value: 'production', label: 'Production' }
];

var listAdditMails = [];

const TabsDev = {
    addTab : 0,
    listTab : 1,
    hfTab : 2
}

class HFRow extends Component {
  constructor() {
      super();
      this.state = this.initializeState();
    }

  initializeState() {
    var initState = {
          plus: true
        }
    return initState;
  }

  handleToggle() {
    this.props.toggleDetail(this.props.hf._id);
    this.setState({plus: !this.state.plus})
  }

  render() {
    var status = _.findWhere(this.props.listStatuses, {value: this.props.hf.status});
    return (
      <tr>
        <td><a onClick={ev => this.handleToggle()}><span className={this.state.plus ? "glyphicon glyphicon-plus" : "glyphicon glyphicon-minus"}></span></a></td>
        <td>HF {this.props.hf.hfNumber}</td>
        <td>{this.props.hf.product.capitalize()}</td>
        <td>{status.label}</td>
        <td>{this.props.hf.modifiedAt.toLocaleString()}</td>
      </tr>
    )
  }
}

class CitRow extends Component {
  constructor() {
      super();
      this.state = this.initializeState();
    }

  initializeState() {
    var initState = {
          plus: true
        }
    return initState;
  }

  handleToggle() {
    this.props.toggleDetail(this.props.cit._id);
    this.setState({plus: !this.state.plus})
  }

  render() {
    let version = _.findWhere(this.props.listVersions, {version: this.props.cit.version, product: this.props.cit.product});
    return (
      <tr>
        <td><a onClick={ev => this.handleToggle()}><span className={this.state.plus? "glyphicon glyphicon-plus" : "glyphicon glyphicon-minus"}></span></a></td>
        <td>CIT-{this.props.cit.citNo}</td>
        <td>{version.label}</td>
        <td>{this.props.cit.components}</td>
        <td>{this.props.cit.email}</td>
        <td>{this.props.cit.createdAt.toLocaleString()}</td>
        <td>{this.props.cit.issueNo}</td>
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
          selectedMails: [],
          additionalMails: "",
          selectedVersions: [],
          description: "",
          priority: ""
        }
    return initState;
  }

  componentWillMount() {
    this.setState({selectedMails: this.props.listMails});
    this.setState({myCITs: _.where(this.props.listCITs, {owner: Meteor.user()._id})})
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
       priority:    this.state.priority,
       description: this.state.description,
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

 getVersionLabel(ver, list) {
   let obj = _.findWhere(list, {version: ver});
   return obj.label.split(/ (.+)/)[1] || "";
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
             options={this.props.listComponents}
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
             options={this.props.listMails}
             onChange={val => this.handleAddMailLists(val)}
             multi

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

 handleToggleDetail(id) {
   document.getElementById(id + "detail").getAttribute("hidden") === null ?
       document.getElementById(id + "detail").setAttribute("hidden", true)
       : document.getElementById(id + "detail").removeAttribute("hidden");

   // console.log(hidden);
 }

 renderTabs() {
     return <ul className="nav nav-tabs tab">
             <li className={(this.state.activeTab == TabsDev.addTab ? "active" : "")}>
               <a href="javascript:void(0)"  onClick={ev => this.onTabSelected(ev, TabsDev.addTab)}>Add CIT</a></li>
             <li className={(this.state.activeTab == TabsDev.listTab ? "active" : "")}>
               <a href="javascript:void(0)" onClick={ev => this.onTabSelected(ev, TabsDev.listTab)}>My CITs</a></li>
             <li className={(this.state.activeTab == TabsDev.hfTab ? "active" : "")}>
               <a href="javascript:void(0)" onClick={ev => this.onTabSelected(ev, TabsDev.hfTab)}>Hotfixes</a></li>
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
     let tmpCits = _.where(this.state.myCITs, {hfId: undefined});

     let key = new Date();

     // console.log(tmpCits);

     if (tmpCits.length !== 0) {
       toReturn = _.union(toReturn,[
         <tr key={key.getTime()+Math.random()}><th colSpan="8">Unassigned</th></tr>,
         ...tmpCits.map((cit) => [
          <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} toggleDetail={this.handleToggleDetail.bind(this)}/>,
          <tr key={cit._id + "detail"} id={cit._id + "detail"} hidden><td colSpan="8">{this.renderCITDetail(cit)}</td></tr>
          ])
       ]);
     }
   }

   //process assigned CITs by HF
   {

     let arrHfs = _.sortBy(this.props.listHFs, function(o){ return -o.modifiedAt;});
     for (let hf of arrHfs) {
       let tmpCits = _.where(this.state.myCITs, {hfId: hf._id});
       let key = new Date();

       if (tmpCits.length !== 0) {
         let version = _.findWhere(this.props.listVersions, {version: hf.version, product: hf.product});
         let label = "HF "+hf.hfNumber+" "+version.label;
         toReturn = _.union(toReturn,[
           <tr key={key.getTime()+Math.random()}><th colSpan="8">{label}</th></tr>,
           ...tmpCits.map((cit) => [
            <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} toggleDetail={this.handleToggleDetail.bind(this)}/>,
            <tr key={cit._id + "detail"} id={cit._id + "detail"} hidden><td colSpan="8">{this.renderCITDetail(cit)}</td></tr>
            ])
         ]);
       }
     }
   }

   return toReturn;
 }

 renderListTab() {
   return (
       <table className="table table-hover">
         <thead>
           <tr>
             <th></th>
             <th>CIT number</th>
             <th>Product</th>
             <th>Components</th>
             <th>Submitted by</th>
             <th>Submitted date</th>
             <th>Issue number</th>
             <th></th>
           </tr>
           {/*<tr>
             <th></th>
             <th></th>
             <th><input type="text"/></th>
             <th><input type="text"/></th>
             <th><input type="text"/></th>
             <th><input type="text"/></th>
             <th><input type="text"/></th>
           </tr>*/}
         </thead>
         <tbody>
           {this.renderCITsByHF()}
         </tbody>
       </table>
   )
 }

 renderCITDetail(cit) {
   return [
     <div key={Math.random()} className="row detail">
       <div className="col-md-2"><b>Description:</b></div>
       <div className="col-md-10">{cit.description}</div>
     </div>,
     <div key={Math.random()} className="row detail">
       <div className="col-md-2"><b>Comment:</b></div>
       <div className="col-md-10">{cit.comment}</div>
     </div>,
     <div key={Math.random()} className="row detail">
       <div className="col-md-2"><b>Priority:</b></div>
       <div className="col-md-10">{cit.priority}</div>
     </div>,
     <div key={Math.random()} className="row detail">
       <div className="col-md-2"><b>Deactivable:</b></div>
       <div className="col-md-10">{cit.deactivable? "True":"False"}</div>
     </div>,
     <div key={Math.random()} className="row detail">
       { cit.test ?
         [<div key={Math.random()} className="col-md-2"><b>Test result:</b></div>,
         <div key={Math.random()} className="col-md-10">{cit.test.capitalize()}</div>]
         : null
       }
   </div>,
     <div key={Math.random()} className="row detail">
       { cit.testedBy ?
         [<div key={Math.random()} className="col-md-2"><b>Tested by:</b></div>,
         <div key={Math.random()} className="col-md-10">{cit.testedBy}</div>]
         : null
       }
     </div>
   ]
 }

 renderHFDetail(hfId) {
   let citList = _.where(this.props.listCITs, {hfId: hfId});
   let obj = [];
   if (citList.length > 0) {
     obj = (
         citList.map((cit) => {
           return (
             <div key={Math.random()} className="row detail">
               <div className="col-md-1">{"CIT-"+cit.citNo}</div>
               <div className="col-md-2">{cit.issueNo}</div>
               <div className="col-md-2">{cit.components}</div>
               <div className="col-md-3">{cit.email}</div>
               <div className="col-md-1">{cit.test ? "Test " + cit.test : ""}</div>
               <div className="col-md-3">{cit.testedBy ? "Tested by "+ cit.testedBy:""}</div>
             </div>
           )
         })
     )
   }
   else {
     obj = (
       <div className="row detail">
         <div className="col-md-3"><b>HF has no CITs!</b></div>
       </div>
     )
   }
   return (<div className="container">{obj}</div>);
 }

 renderHFsByVersion() {
   var toReturn = [];
   for (ver of this.props.arrVersions) {
     let tmpHFs = _.where(this.props.listHFs, {version: ver});
     let key = new Date();
     ver = this.getVersionLabel(ver, this.props.listVersions);
     if ( tmpHFs.length > 0 )
     {
       var hfRow = tmpHFs.map((hf) => {
         return([
           <HFRow key={hf._id } hf={hf} listStatuses={this.props.listStatuses} toggleDetail={this.handleToggleDetail.bind(this)}/>,
           <tr key={hf._id + "detail"} id={hf._id + "detail"} hidden><td colSpan="6">{this.renderHFDetail(hf._id)}</td></tr>
         ]);
       });

       toReturn = _.union(toReturn,[<tr key={key.getTime()+Math.random()}><th colSpan="6">{ver}</th></tr>]);
       toReturn = _.union(toReturn, hfRow);

       // toReturn = _.union(toReturn,[
       //   <tr key={key.getTime()+Math.random()}><th colSpan="6">{ver}</th></tr>,
       //   ...tmpHFs.map((hf) => <HFRow key={hf._id } hf={hf} listStatuses={this.props.listStatuses}/>)
       // ]);
     }
   }
   return toReturn;
 }

 renderHFTab() {
   return (
     <table className="table table-hover">
       <thead>
         <tr>
           <th></th>
           <th>HF number</th>
           <th>Product</th>
           <th>Status</th>
           <th>Last modify</th>
           <th/>
         </tr>
         {/*<tr>
           <th></th>
           <th><input type="text"/></th>
           <th><input type="text"/></th>
           <th><input type="text"/></th>
           <th><input type="text"/></th>
           <th/>
         </tr>*/}
       </thead>
       <tbody>
         {this.renderHFsByVersion()}
       </tbody>
     </table>
   )
 }

 render() {
   return (
     <div>
       {this.renderTabs()}
       {this.state.activeTab == TabsDev.addTab ? this.renderAddTab() : (this.state.activeTab == TabsDev.listTab ? this.renderListTab() : this.renderHFTab())}
     </div>
   )
 }

};
