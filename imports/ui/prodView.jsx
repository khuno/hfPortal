import React, { Component, PropTypes } from 'react';


const TabsDev = {
    hfTab : 0,
    citTab : 1
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

export default class ProdView extends Component {

  constructor() {
      super();
      this.state = this.initializeState();
    }

  initializeState() {
    var initState = {
          activeTab: TabsDev.hfTab,
        }
    return initState;
  }

  onTabSelected(ev, selectedTab) {
          this.setState({ activeTab: selectedTab });
      }

  renderTabs() {
      return <ul className="nav nav-tabs tab">
              <li className={(this.state.activeTab == TabsDev.hfTab ? "active" : "")}>
                <a href="javascript:void(0)"  onClick={ev => this.onTabSelected(ev, TabsDev.hfTab)}>HF List</a></li>
              <li className={(this.state.activeTab == TabsDev.citTab ? "active" : "")}>
                <a href="javascript:void(0)" onClick={ev => this.onTabSelected(ev, TabsDev.citTab)}>List of all CITs</a></li>
            </ul>;
  }

  renderHFTable() {
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>HF number</th>
            <th>Product</th>
            <th>Status</th>
            <th>Last modify</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
            <th><input type="text"/></th>
          </tr>
        </thead>
        <tbody>
          <tr><th colSpan="6">V8 R0.0</th></tr>
          <tr>
            <td><input type="checkbox" /></td>
            <td><span className="glyphicon glyphicon-plus"></span></td>
            <td>HF 1</td>
            <td>Assistant</td>
            <td> <StatusButton state="Released"/></td>
            <td>20.12.2016</td>
          </tr>
          <tr>
            <td><input type="checkbox" /></td>
            <td><span className="glyphicon glyphicon-plus"></span></td>
            <td>HF 1</td>
            <td>Manager</td>
            <td><StatusButton state="Produced" /></td>
            <td>20.12.2016</td>
          </tr>
          <tr><th colSpan="6">V7 R2.0</th></tr>
          <tr>
            <td><input type="checkbox" /></td>
            <td><span className="glyphicon glyphicon-plus"></span></td>
            <td>HF 8</td>
            <td>Assistant</td>
            <td><StatusButton state="Started up/In test" /></td>
            <td>06.06.2016</td>
          </tr>
          <tr>
            <td><input type="checkbox" /></td>
            <td><span className="glyphicon glyphicon-plus"></span></td>
            <td>HF 8</td>
            <td>Manager</td>
            <td><StatusButton state="Tested"/></td>
            <td>07.06.2016</td>
          </tr>
        </tbody>
      </table>
    )
  }

  renderHFTab() {
    return (
      <div className="container" id="hfList">
        <div className="row"></div>
        <div className="row">
          <button type="button" className="btn btn-info">
            Define new HF
          </button>
        </div>
        {this.renderHFTable()}
      </div>
    )
  }

  renderCITTab() {
    return (
      <div className="container" id="citList">
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
            <tr><th colSpan="7">Unassigned</th></tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td><span className="glyphicon glyphicon-plus"></span></td>
              <td>UAS41854866</td>
              <td>Assistant</td>
              <td>Sergii</td>
              <td>20.12.2016</td>
              <td>SWM restarting problem</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td><span className="glyphicon glyphicon-plus"></span></td>
              <td>UAS41854866</td>
              <td>Manager</td>
              <td>Sergii</td>
              <td>20.12.2016</td>
              <td>SWM restarting problem</td>
            </tr>
            <tr><th colSpan="7">HF9 V7 R2.0</th></tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td><span className="glyphicon glyphicon-plus"></span></td>
              <td>UAS789654654</td>
              <td>Assistant</td>
              <td>Martin</td>
              <td>06.06.2016</td>
              <td>Segfault snmp deamon</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td><span className="glyphicon glyphicon-plus"></span></td>
              <td>UAS789654654</td>
              <td>Manager</td>
              <td>Martin</td>
              <td>07.06.2016</td>
              <td>Segfault snmp deamon</td>
            </tr>
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
