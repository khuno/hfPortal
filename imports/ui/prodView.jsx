import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { Meteor } from 'meteor/meteor';
import 'react-select/dist/react-select.css';


const TabsDev = {
    hfTab : 0,
    citTab : 1
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

class StatusButton extends Component {

  render() {
    return (
      <div className="btn-group">
        <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {this.props.state} <span className="caret"></span>
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
    )
  }
}

class CitRow extends Component {

  render() {
    //console.log(this.props);
    let version = _.findWhere(this.props.listVersions, {version: this.props.cit.version});
    //console.log(version);
    return (
      <tr>
        <td><input type="checkbox" /></td>
        <td><span className="glyphicon glyphicon-plus"></span></td>
        <td>{this.props.cit._id}</td>
        <td>{version.label}</td>
        <td>{this.props.cit.email}</td>
        <td>{this.props.cit.createdAt.toLocaleString()}</td>
        <td>{this.props.cit.description}</td>
      </tr>
    )
  }
}

class HFRow extends Component {
  render() {
    return (
      <tr>
        <td><span className="glyphicon glyphicon-plus"></span></td>
        <td>HF {this.props.hf.hfNumber}</td>
        <td>{this.props.hf.product.capitalize()}</td>
        <td><StatusButton state={this.props.hf.status}/></td>
        <td>{this.props.hf.modifiedAt.toLocaleString()}</td>
      </tr>
    )
  }
}

export default class ProdView extends Component {

  constructor() {
      super();
      this.state = this.initializeState();
    }

  initializeState() {
    var initState = {
          activeTab: TabsDev.hfTab,
          defineHF: false,
          selectedVersion: "",
          buttonHFDisabled: false,
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

  handleDefineHF() {
    if (this.state.defineHF === false) {
      this.setState({defineHF: true, buttonHFDisabled: true});
    }
    else {
      /*let hf = {
        version: this.state.selectedVersion.value,
      }*/
      console.log(this.state.selectedVersion.value);
      Meteor.call('hfs.insert', this.state.selectedVersion);

      this.setState(this.initializeState());
    }
  }

  handleCancel() {
    this.setState({
      defineHF: false,
      selectedVersion: "",
      buttonHFDisabled: false
    });
  }

  handleSelectedVersion(val) {
    this.setState({ selectedVersion: val, buttonHFDisabled: !this.state.buttonHFDisabled});
  }

  renderTabs() {
      return <ul className="nav nav-tabs tab">
              <li className={(this.state.activeTab == TabsDev.hfTab ? "active" : "")}>
                <a href="javascript:void(0)"  onClick={ev => this.onTabSelected(ev, TabsDev.hfTab)}>HF List</a></li>
              <li className={(this.state.activeTab == TabsDev.citTab ? "active" : "")}>
                <a href="javascript:void(0)" onClick={ev => this.onTabSelected(ev, TabsDev.citTab)}>List of all CITs</a></li>
            </ul>;
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
          <tr key={key.getTime()+Math.random()}><th colSpan="5">{ver}</th></tr>,
          ...tmpHFs.map((hf) => <HFRow key={hf._id } hf={hf}/>)
        ]);
      }
    }
    return toReturn;
  }

  renderHFTable() {
    console.log();
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th></th>
            <th>HF number</th>
            <th>Product</th>
            <th>Status</th>
            <th>Last modify</th>
          </tr>
          <tr>
            <th></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
          </tr>
        </thead>
        <tbody>
          {this.renderHFsByVersion()}
        </tbody>
      </table>
    )
  }

  renderDefiningForm() {
    return (
      <div className="col-md-2">
        <Select
          name="form-field-name"
          value={this.state.selectedVersion}
          options={this.props.listVersions}
          onChange={val => this.handleSelectedVersion(val)}
          placeholder='Select version...'
        />

      </div>
    )
  }

  renderHFTab() {
    return (
      <div className="container" id="hfList">
        <div className="row">
          {this.state.defineHF ? this.renderDefiningForm() : null}
          <div className="col-md-4">
            <button type="button" className="btn btn-info" onClick={this.handleDefineHF.bind(this)} disabled={this.state.buttonHFDisabled}>
              Define new HF
            </button>
            {this.state.defineHF ? <button type="button" className="btn btn-error" onClick={this.handleCancel.bind(this)}>Cancel</button> : null}
          </div>
        </div>
        {this.renderHFTable()}
      </div>
    )
  }

  renderCITsByHF(hfVer) {
    var unsCits = [];
    console.log(hfVer);
    if ( hfVer == undefined ) {
      unsCits = _.where(this.props.listCITs, {hf: undefined});
      hfVer = "Unassigned";
    }
    else {
      unsCits = _.where(this.props.listCITs, {hf: hfVer});
    }

    let key = new Date();
    console.log(unsCits);
    var toReturn = [];
    //if any CIT not included to HF
    if (unsCits.length !== 0) {
      toReturn = [
        <tr key={key.getTime()}><th colSpan="7">{hfVer}</th></tr>,
        ...unsCits.map((cit) => <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions}/>)
      ];
    }

    return toReturn;
  }

  renderCITTab() {
    return (
      <div className="container" id="citList">
        <div className="row">
          <button type="button" className="btn btn-info">
            Add to HF
          </button>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>CIT number</th>
              <th>Product</th>
              <th>Submitted by</th>
              <th>Submitted date</th>
              <th>Description</th>
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
            {this.renderCITsByHF("HF9 V7 R2.0")}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
      return (
        <div>
         {this.renderTabs()}
         {this.state.activeTab == TabsDev.hfTab ? this.renderHFTab() : this.renderCITTab()}
       </div>
      )
  }

};
