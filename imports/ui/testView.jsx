import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { Meteor } from 'meteor/meteor';
import 'react-select/dist/react-select.css';

const TabsDev = {
    testTab : 0,
    hfTab : 1
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

  createLabelHF(hf) {
    let label = "HF ";
    let version = _.findWhere(this.props.listVersions, {version: hf.version, product: hf.product});
    label += hf.hfNumber + " " + version.label;

    return label;
  }

  addToHF(hf) {
    console.log(hf);

    Meteor.call('cits.addToHF', this.props.cit._id, hf._id);

    if (hf.status == 'defined' || hf.status == 'requested') {

    }
    else {
      Meteor.call('hfs.setStatus', hf, "repro_req");
    }

  }

  handleOnChange () {
    console.log(this.props.cit._id);

    this.props.handleCheckboxChange(this.props.cit._id);
  }

  render() {
    //console.log(this.props);
    let version = _.findWhere(this.props.listVersions, {version: this.props.cit.version, product: this.props.cit.product});
    //console.log(version);
    return (
      <tr>
        <td>{this.props.checked !== undefined ? <input type="checkbox" checked={this.props.checked} onChange={ev => this.handleOnChange()}/> : null }</td>
        <td><span className="glyphicon glyphicon-plus"></span></td>
        <td>CIT-{this.props.cit.citNo}</td>
        <td>{this.props.cit.components}</td>
        <td>{this.props.cit.email}</td>
        <td>{this.props.cit.createdAt.toLocaleString()}</td>
        <td>{this.props.cit.description}</td>
        {/*<td>
          {this.props.listHFs.length == 0 ?
            null
            :
            <div className="btn-group">
              <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Add to
              </button>
              <ul className="dropdown-menu dropdown-menu-right">
                {this.props.listHFs.map((hf) => (<li key={Math.random()}><a href="javascript:void(0)" onClick={ev => this.addToHF(hf)}>{this.createLabelHF(hf)}</a></li>))}
              </ul>
            </div>
          }
        </td>*/}
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
            <tr key={key.getTime()+Math.random()}><th colSpan="8">{label}</th></tr>,
              ...tmpCits.map((cit) => <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} listHFs={[]}/>)
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
