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
    console.log(this.props.hf._id,toStatus);
    Meteor.call('hfs.setStatus', this.props.hf, toStatus);
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

  handleToggle() {
    this.props.toggleDetail(this.props.cit._id);
    this.setState({plus: !this.state.plus})
  }

  render() {
    //console.log(this.props);
    let version = _.findWhere(this.props.listVersions, {version: this.props.cit.version, product: this.props.cit.product});
    //console.log(version);
    return (
      <tr>
        <td>{this.props.checked !== undefined ? <input type="checkbox" checked={this.props.checked} onChange={ev => this.handleOnChange()}/> : null }</td>
        <td><a onClick={ev => this.handleToggle()}><span className={this.state.plus? "glyphicon glyphicon-plus" : "glyphicon glyphicon-minus"}></span></a></td>
        <td>{"CIT-"+this.props.cit.citNo}</td>
        <td>{version.label}</td>
        <td>{this.props.cit.components}</td>
        <td>{this.props.cit.email}</td>
        <td>{this.props.cit.createdAt.toLocaleString()}</td>
        <td>{this.props.cit.issueNo}</td>
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

  handleProduceClick() {
    this.props.produce(this.props.hf._id);
  }

  handleToggle() {
    this.props.toggleDetail(this.props.hf._id);
    this.setState({plus: !this.state.plus})
  }

  render() {
    return (
      <tr>
        <td><a onClick={ev => this.handleToggle()}><span className={this.state.plus ? "glyphicon glyphicon-plus" : "glyphicon glyphicon-minus"}></span></a></td>
        <td>HF {this.props.hf.hfNumber}</td>
        <td>{this.props.hf.product.capitalize()}</td>
        <td className="statusClmn"><StatusButton state={this.props.hf.status} listStatuses={this.props.listStatuses} hf={this.props.hf}/>
            {this.props.hf.status === "requested"?<button type="button" className="btn-xs btn-info" data-toggle="modal" data-target="#componetDialog" onClick={ev => this.handleProduceClick()}>Produce</button>:null}
            {this.props.hf.status === "repro_req"?<button type="button" className="btn-xs btn-info">Reproduce</button>:null}</td>
        <td>{this.props.hf.modifiedAt.toLocaleString()}</td>
        <td>{this.props.hf.status === "requested" || this.props.hf.status === "defined"?
          <button type="button" className="btn-xs btn-error"><span className="glyphicon glyphicon-remove" /></button>
          :null}
        </td>
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
          componentsToProduce: []
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

  handleProduceButton(hfId) {
    let tmp = _.where(this.props.listCITs, {hfId: hfId});
    let componetList = [];
    for (cit of tmp) {
      componetList = _.union(componetList, cit.components.split(','));
    }
    console.log(componetList);
    this.setState({componentsToProduce: componetList});
  }

  handleToggleDetail(id) {
    document.getElementById(id + "detail").getAttribute("hidden") === null ?
        document.getElementById(id + "detail").setAttribute("hidden", true)
        : document.getElementById(id + "detail").removeAttribute("hidden");

    // console.log(hidden);
  }

  renderTabs() {
      return <ul className="nav nav-tabs tab">
              <li className={(this.state.activeTab == TabsDev.hfTab ? "active" : "")}>
                <a href="javascript:void(0)"  onClick={ev => this.onTabSelected(ev, TabsDev.hfTab)}>HotFixes</a></li>
              <li className={(this.state.activeTab == TabsDev.citTab ? "active" : "")}>
                <a href="javascript:void(0)" onClick={ev => this.onTabSelected(ev, TabsDev.citTab)}>CITs</a></li>
            </ul>;
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
            <HFRow key={hf._id } hf={hf} listStatuses={this.props.listStatuses} produce={this.handleProduceButton.bind(this)} toggleDetail={this.handleToggleDetail.bind(this)}/>,
            <tr key={hf._id + "detail"} id={hf._id + "detail"} hidden><td colSpan="6">{this.renderHFDetail(hf._id)}</td></tr>
          ]);
        });

        toReturn = _.union(toReturn,[<tr key={key.getTime()+Math.random()}><th colSpan="6">{ver}</th></tr>]);
        toReturn = _.union(toReturn, hfRow);
        // toReturn = _.union(toReturn,[
        //   <tr key={key.getTime()+Math.random()}><th colSpan="6">{ver}</th></tr>,
        //   ...tmpHFs.map((hf) => <HFRow key={hf._id } hf={hf} listStatuses={this.props.listStatuses} produce={this.handleProduceButton.bind(this)}/>)
        // ]);
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

  renderDialog() {
    return (
      <div className="modal fade" id="componetDialog" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <h4 className="modal-title">Components list:</h4>
              <p>{this.state.componentsToProduce.length === 0 ? "No Componets to produce" : this.state.componentsToProduce.join(' ')}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>

        </div>
      </div>
    )
  }

  renderHFTab() {
    return (
      <div id="hfList">
        {this.renderDialog()}
        <div className="container row btnGrp">
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
            let obj = {};
            let hf = (this.state.addCITsToHf ? _.findWhere(this.props.listHFs, {_id: this.state.addCITsToHf.hfId }) : undefined);
            if (hf !== undefined) {
              if (cit.version === hf.version && cit.product === hf.product)
              {
                obj = <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} listHFs={this.possibleHFs(cit)}
                       checked={_.contains(this.state.checkedCITs, cit._id)} handleCheckboxChange={this.toggleCheckbox.bind(this)} toggleDetail={this.handleToggleDetail.bind(this)}/>
              }
              else {
                obj = <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} listHFs={this.possibleHFs(cit)} toggleDetail={this.handleToggleDetail.bind(this)}/>
              }
            }
            else {
              obj = <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} listHFs={this.possibleHFs(cit)} toggleDetail={this.handleToggleDetail.bind(this)}/>
            }

            return [
              obj,
              <tr key={cit._id + "detail"} id={cit._id + "detail"} hidden><td colSpan="8">{this.renderCITDetail(cit)}</td></tr>
            ]
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
            ...tmpCits.map((cit) => [
              <CitRow key={cit._id } cit={cit} listVersions={this.props.listVersions} listHFs={[]} toggleDetail={this.handleToggleDetail.bind(this)}/>,
              <tr key={cit._id + "detail"} id={cit._id + "detail"} hidden><td colSpan="8">{this.renderCITDetail(cit)}</td></tr>
            ])
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
        Meteor.call('hfs.setStatus', hf, "repro_req");
      }
    });

    this.setState({checkedCITs: undefined, addCITsToHf: undefined});

  }

  handleCancelAddtoHF() {
    this.setState({checkedCITs: undefined, addCITsToHf: undefined});
  }

  renderCITTab() {
    return (
      <div id="citList">
        <div className="container row btnGrp">
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
              <th>Issue number</th>
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
