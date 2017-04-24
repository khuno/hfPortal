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
  render() {
    var status = _.findWhere(this.props.listStatuses, {value: this.props.hf.status});
    return (
      <tr>
        <td><span className="glyphicon glyphicon-plus"></span></td>
        <td>HF {this.props.hf.hfNumber}</td>
        <td>{this.props.hf.product.capitalize()}</td>
        <td>{status.label}</td>
        <td>{this.props.hf.modifiedAt.toLocaleString()}</td>
      </tr>
    )
  }
}

class CitRow extends Component {

  handleTestResult(result) {
    if (result === 1) {
      Meteor.call('test.setTestResult', this.props.cit._id, "passed", this.props.cit.hfId);
    }
    else if (result === 0) {
      Meteor.call('test.setTestResult', this.props.cit._id, "failed", this.props.cit.hfId);
    }
  }

  render() {
    return (
      <tr>
        <td></td>
        <td><span className="glyphicon glyphicon-plus"></span></td>
        <td>CIT-{this.props.cit.citNo}</td>
        <td>{this.props.cit.components}</td>
        <td>{this.props.cit.email}</td>
        <td>{this.props.cit.createdAt.toLocaleString()}</td>
        <td>{this.props.cit.description}</td>
        <td>{this.props.cit.testedBy ? this.props.cit.testedBy : "Waiting for test"}</td>
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
              ...tmpCits.map((cit) => <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} />)
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
            <th>Description</th>
            <th>Tested By</th>
            <th>Test Result</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.renderCITsForTest()}
        </tbody>
      </table>
    )
  }

  renderHFsByVersion() {
    var toReturn = [];
    for (ver of this.props.arrVersions) {
      let tmpHFs = _.where(this.props.listHFs, {version: ver});
      let key = new Date();
      ver = this.getVersionLabel(ver, this.props.listVersions);
      if ( tmpHFs.length > 0 )
      {
        toReturn = _.union(toReturn,[
          <tr key={key.getTime()+Math.random()}><th colSpan="6">{ver}</th></tr>,
          ...tmpHFs.map((hf) => <HFRow key={hf._id } hf={hf} listStatuses={this.props.listStatuses}/>)
        ]);
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
          <tr>
            <th></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th/>
          </tr>
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
