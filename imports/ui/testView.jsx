import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { Meteor } from 'meteor/meteor';
import 'react-select/dist/react-select.css';

const TabsDev = {
    testTab : 0,
    hfTab : 1
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
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

  handleTestResult(result) {
    if (result === 1) {
      Meteor.call('test.setTestResult', this.props.cit._id, "passed", this.props.cit.hfId);
    }
    else if (result === 0) {
      Meteor.call('test.setTestResult', this.props.cit._id, "failed", this.props.cit.hfId);
    }
  }

  handleToggle() {
    this.props.toggleDetail(this.props.cit._id);
    this.setState({plus: !this.state.plus})
  }

  render() {
    return (
      <tr>
        <td></td>
        <td><a onClick={ev => this.handleToggle()}><span className={this.state.plus? "glyphicon glyphicon-plus" : "glyphicon glyphicon-minus"}></span></a></td>
        <td>CIT-{this.props.cit.citNo}</td>
        <td>{this.props.cit.components}</td>
        <td>{this.props.cit.email}</td>
        <td>{this.props.cit.createdAt.toLocaleString()}</td>
        <td>{this.props.cit.issueNo}</td>
        <td>{this.props.cit.testedBy ? this.props.cit.testedBy : ""}</td>
        <td>
            <div className="btn-group">
              <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {this.props.cit.test ? this.props.cit.test.capitalize() : 'Test...'}
              </button>
              <ul className="dropdown-menu dropdown-menu-right">
                <li><a href="javascript:void(0)" onClick={ev => this.handleTestResult(1)}>Passed</a></li>
                <li><a href="javascript:void(0)" onClick={ev => this.handleTestResult(0)}>Failed</a></li>
              </ul>
            </div>
        </td>
      </tr>
    )
  }
}

export default class TestView extends Component {

  constructor() {
      super();
      this.state = this.initializeState();
    }

  initializeState() {
    var initState = {
          activeTab: TabsDev.testTab,
        }
    return initState;
  }

  getVersionLabel(ver, list) {
    let obj = _.findWhere(list, {version: ver});
    return obj.label.split(/ (.+)/)[1] || "";
  }

  onTabSelected(ev, selectedTab) {
    this.setState({ activeTab: selectedTab });
  }

  handleToggleDetail(id) {
    document.getElementById(id + "detail").getAttribute("hidden") === null ?
        document.getElementById(id + "detail").setAttribute("hidden", true)
        : document.getElementById(id + "detail").removeAttribute("hidden");

    // console.log(hidden);
  }

  renderTabs() {
    return (
      <ul className="nav nav-tabs tab">
        <li className={(this.state.activeTab == TabsDev.testTab ? "active" : "")}>
          <a href="javascript:void(0)"  onClick={ev => this.onTabSelected(ev, TabsDev.testTab)}>Tests</a></li>
        <li className={(this.state.activeTab == TabsDev.hfTab ? "active" : "")}>
          <a href="javascript:void(0)" onClick={ev => this.onTabSelected(ev, TabsDev.hfTab)}>Hot Fixes</a></li>
      </ul>);
  }

  renderCITsForTest() {
    var toReturn = [];

    let arrHfs = _.sortBy(this.props.listHFs, function(o){ return -o.modifiedAt;});
    for (let hf of arrHfs) {
      if(hf.status === "produced" || hf.status === "start_test")
      {
        let tmpCits = _.where(this.props.listCITs, {hfId: hf._id});
        var status = _.findWhere(this.props.listStatuses, {value: hf.status});
        let key = new Date();

        if (tmpCits.length !== 0) {
          let version = _.findWhere(this.props.listVersions, {version: hf.version, product: hf.product});
          let label = "HF "+hf.hfNumber+" "+version.label+ " ("+status.label+")";
          toReturn = _.union(toReturn,[
            <tr key={key.getTime()+Math.random()}><th colSpan="9">{label}</th></tr>,
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

  renderTestTab() {
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>CIT number</th>
            <th>Components</th>
            <th>Submitted by</th>
            <th>Submitted date</th>
            <th>Issue number</th>
            <th>Tested By</th>
            <th>Test Result</th>
          </tr>
          {/*<tr>
            <th></th>
            <th></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th></th>
          </tr>*/}
        </thead>
        <tbody>
          {this.renderCITsForTest()}
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
        {this.state.activeTab == TabsDev.testTab ? this.renderTestTab() : this.renderHFTab()}
      </div>
    )
  }

}
