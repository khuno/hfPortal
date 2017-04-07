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

  changeStatus(toStatus) {
    console.log(this.props.hfId,toStatus);
    Meteor.call('hfs.setStatus', this.props.hfId, toStatus);
  }

  renderNextStatuses(currentStatus) {
    // console.log(currentStatus);
    // console.log(currentStatus.nextStatuses);
    return (
      <ul className="dropdown-menu">
        {currentStatus.nextStatuses.map((next) => (<li key={Math.random()}><a href="javascript:void(0)" onClick={ev => this.changeStatus(next)}>{_.findWhere(this.props.listStatuses, {value: next}).label}</a></li>))}
      </ul>)
  }

  render() {
    let status = _.findWhere(this.props.listStatuses, {value: this.props.state});
    var toReturn = {};
    if (status.nextStatuses.length != 0)
    {
      // console.log(status);
      toReturn = (
        <div className="btn-group">
          <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {status.label} <span className="caret"></span>
          </button>
          {this.renderNextStatuses(status)}
        </div>
      )
    }
    else {
      toReturn = (
        <b>{status.label}</b>
      )
    }
    return toReturn;
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
      Meteor.call('hfs.setStatus', hf._id, "repro_req");
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
        <td>{version.label}</td>
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

class HFRow extends Component {
  render() {
    return (
      <tr>
        <td><span className="glyphicon glyphicon-plus"></span></td>
        <td>HF {this.props.hf.hfNumber}</td>
        <td>{this.props.hf.product.capitalize()}</td>
        <td><StatusButton state={this.props.hf.status} listStatuses={this.props.listStatuses} hfId={this.props.hf._id}/>
            {this.props.hf.status == "requested"?<button type="button" className="btn btn-info">Produce</button>:null}
            {this.props.hf.status == "repro_req"?<button type="button" className="btn btn-info">Reproduce</button>:null}</td>
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
          ...tmpHFs.map((hf) => <HFRow key={hf._id } hf={hf} listStatuses={this.props.listStatuses}/>)
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
        <div className="row btnGrp">
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


  possibleHFs(cit) {
    // console.log(cit);

    let possibleHFs = _.filter(this.props.listHFs, function(hf) {
      return hf.product === cit.product && hf.version === cit.version && hf.status !== "released";
    });
    // console.log(possibleHFs);

    return possibleHFs;
  }

  renderCITsByHF() {
    var toReturn = [];
    //process unassigned CITs
    {
      let tmpCits = _.where(this.props.listCITs, {hfId: undefined});

      let key = new Date();

      // console.log(tmpCits);

      if (tmpCits.length !== 0) {
        toReturn = _.union(toReturn,[
          <tr key={key.getTime()+Math.random()}><th colSpan="8">Unassigned</th></tr>,
          ...tmpCits.map((cit) => {
            let hf = (this.state.addCITsToHf ? _.findWhere(this.props.listHFs, {_id: this.state.addCITsToHf.hfId }) : undefined);
            if (hf !== undefined) {
              if (cit.version === hf.version && cit.product === hf.product)
              {
                return <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} listHFs={this.possibleHFs(cit)}
                                          checked={_.contains(this.state.checkedCITs, cit._id)} handleCheckboxChange={this.toggleCheckbox.bind(this)}/>
              }
              else {
                return <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} listHFs={this.possibleHFs(cit)}/>
              }
            }
            else {
              return <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} listHFs={this.possibleHFs(cit)}/>
            }
          })
        ]);
      }
    }

    //process assigned CITs by HF
    {

      let arrHfs = _.sortBy(this.props.listHFs, function(o){ return -o.modifiedAt;});
      for (let hf of arrHfs) {
        // console.log(hf);
        // console.log(this.props);
        let tmpCits = _.where(this.props.listCITs, {hfId: hf._id});
        let key = new Date();

        // console.log(tmpCits);

        if (tmpCits.length !== 0) {
          let version = _.findWhere(this.props.listVersions, {version: hf.version, product: hf.product});
          let label = "HF "+hf.hfNumber+" "+version.label;
          toReturn = _.union(toReturn,[
            <tr key={key.getTime()+Math.random()}><th colSpan="8">{label}</th></tr>,
            ...tmpCits.map((cit) => <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} listHFs={[]}/>)
          ]);
        }
      }
    }

    return toReturn;
  }

  toggleCheckbox(cit){
    let set = new Set(this.state.checkedCITs);
    if (set.has(cit)) {
      set.delete(cit);
      this.setState({checkedCITs: Array.from(set)});
    } else {
      set.add(cit);
      this.setState({checkedCITs: Array.from(set)});
    }
  }

  createLabelHF(hf) {
    let label = "HF ";
    let version = _.findWhere(this.props.listVersions, {version: hf.version, product: hf.product});
    label += hf.hfNumber + " " + version.label;

    return label;
  }

  checkCITs(ev, hf) {
    let cits = _.where(this.props.listCITs, {version: hf.version, product: hf.product, hfId: undefined});
    if (cits.length !== 0) {
      let citsId = cits.map(function(cit) {return cit._id});
      this.setState({checkedCITs: citsId, addCITsToHf: {hfId :hf._id, label: ev.target.text}});
    }
    else {
      console.log("none cit for this HF");
    }
  }

  handleAddtoHF() {
    let hf = _.findWhere(this.props.listHFs, {_id: this.state.addCITsToHf.hfId});
    this.state.checkedCITs.forEach(function(citId){
      Meteor.call('cits.addToHF', citId, hf._id);
      if (hf.status == 'defined' || hf.status == 'requested') {

      }
      else {
        Meteor.call('hfs.setStatus', hf._id, "repro_req");
      }
    });

    this.setState({checkedCITs: undefined, addCITsToHf: undefined});

  }

  handleCancelAddtoHF() {
    this.setState({checkedCITs: undefined, addCITsToHf: undefined});
  }

  renderCITTab() {
    return (
      <div className="container" id="citList">
        <div className="row btnGrp">
          {this.props.listHFs.length == 0 ?
            null
            :
            <div className="btn-group">
              <button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Add to <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                {this.props.listHFs.filter(function(hf){return hf.status !== "released"}).map((hf) => (<li key={Math.random()}><a href="javascript:void(0)" onClick={ev => this.checkCITs(ev, hf)}>{this.createLabelHF(hf)}</a></li>))}
              </ul>
            </div>
            }
           {this.state.addCITsToHf && this.state.checkedCITs.length !== 0 ?
             <div className="btn-group" role="group">
               <button type="button" className="btn btn-success" onClick={ev => this.handleAddtoHF()}>
                 Add to {this.state.addCITsToHf.label} ({this.state.checkedCITs.length} checked)
               </button>
               <button type="button" className="btn btn-danger" onClick={ev => this.handleCancelAddtoHF()}>
                 Cancel
               </button>
           </div>
             : null}
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th></th>
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
         {this.state.activeTab == TabsDev.hfTab ? this.renderHFTab() : this.renderCITTab()}
       </div>
      )
  }

};
