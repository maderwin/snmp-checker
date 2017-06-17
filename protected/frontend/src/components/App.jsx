import React, { Component } from 'react';
import Axios from 'axios';
import { Sidebar, Segment, Menu, Icon} from 'semantic-ui-react'
import QueryString from 'query-string';
import Filter from './Filter';
import Chart from './Chart';
import IpList from './IpList';

import 'semantic-ui-css/semantic.min.css';

const rootUrl = '.';

export default class App extends Component {
  constructor(){
    super();

    this.state = {
      view: {
        sidebar: false,
        iplist: true,
        stacked: false,
        loading: 0
      },
      group: {
        enabled: true,
        field: {
          selected: 'both',
          options: [
            {key: 'both', value: "both", text:"IP+SSID"},
            {key: 'ip', value: "ip", text:"Only IP"},
            {key: 'ssid', value: "ssid", text:"Only SSID"}
          ]
        },
        period: {
          selected: 'hour',
          options: [
            {key: false, value: false, text:"Do not group"},
            {key: 'hour', value: "hour", text:"Group by hour"},
            {key: 'weekday', value: "weekday", text:"Group by weekday"}
          ]
        },
        func: {
          selected: 'avg',
          options: [
            {key: 'avg', value: "avg", text:"Average"},
            {key: 'sum', value: "sum", text:"Sum"}
          ]
        },
      },
      filter: {
        start: null,
        end: null,
        keys: [],
      },
      iplist: [],
      iplist_add: [],
      iplist_del: [],
      data: {
        query: false,
        error: false,
        result: {
          keys: []
        }
      }
    };

  }

  componentDidMount() {
    this.updateData(this.buildQuery());
    this.fetchIpList();
  }

  toggleSidebar() {
    this.setState((state) => {
      state.view.sidebar = !state.view.sidebar;
      state.view.iplist = false;
    });
  }
  toggleIpList() {
    this.setState((state) => {
      state.view.iplist = !state.view.iplist
      state.view.sidebar = false;
    });
  }

  buildQuery(){
    let query = rootUrl;
    if(this.state.group.enabled){
       query += '/' + this.state.group.period.selected;
       query += '/' + this.state.group.field.selected;
       query += '.json';
    }else{
      query += '/latest';
      query += '/' + this.state.group.field.selected;
      query += '.json';
    }

    if(this.state.filter.start || this.state.filter.end){
      let params = {};
      if(this.state.filter.start){
        params.start = this.state.filter.start.format('YYYY-MM-DD');
      }
      if(this.state.filter.end){
        params.end = this.state.filter.end.format('YYYY-MM-DD');
      }
      query += '?' + QueryString.stringify(params);
    }

    return query;
  }

  fetchIpList(){
    Axios.get(rootUrl + '/ip.json')
      .then(response => {
        this.setState({
          iplist: response.data,
          iplist_add: [],
          iplist_del: []
        });
      })
      .catch(error => {
        this.setState({
          iplist_add: [],
          iplist_del: []
        });
      });
  }

  deleteIp(ip){
    Axios.get(rootUrl + '/ip/delete/' + ip)
      .then(response => {
      this.setState({
        iplist: response.data,
        iplist_del: this.state.iplist_del.filter(item=>item!==ip)
      });
    })
      .catch(error => {
        this.setState({
          iplist_del: this.state.iplist_del.filter(item=>item!==ip)
        });
      });
  }

  addIp(ip){
    this.setState({
      iplist_add: this.state.iplist_add.concat([ip])
    });
    Axios.get(rootUrl + '/ip/add/' + ip)
      .then(response => {
        this.setState({
          iplist: response.data,
          iplist_add: this.state.iplist_add.filter(item=>item!==ip)
        });
      })
      .catch(error => {
        this.setState({
          iplist_add: this.state.iplist_add.filter(item=>item!==ip)
        });
      });
  }

  updateData(query){
    this.setState((state)=>{
      state.view.loading++;
      return state;
    });

    Axios.get(query)
      .then((response)=>{
        this.setState((state)=>{
          state.data.result = response.data;
          state.data.query = query;
          state.data.error = false;
          state.view.loading--;
          return state;
        })
      })
      .catch((error)=>{
        this.setState((state)=> {
          state.view.loading--;
          state.data.error = error;
          return state;
        });
      })
  }

  onFilterChange(filterState) {
    this.setState(filterState);
    let query = this.buildQuery();
    if(query !== this.state.data.query){
      this.updateData(query);
    }
  }

  render() {
    return (
      <div className="App">
        <Menu className='top attached'>
          <Menu.Item
            active={this.state.view.sidebar}
            onClick={() => this.toggleSidebar()}>
            <Icon name='options' />
            Filter
          </Menu.Item>
          <Menu.Item
            position="right"
            active={this.state.view.iplist}
            onClick={() => this.toggleIpList()}>
            <Icon name='list layout' />
            IP
          </Menu.Item>
        </Menu>
        <Sidebar.Pushable as={Segment} className='bottom attached'>
          <Filter
            state={this.state}
            onChange={(state) => this.onFilterChange(state)}
          />
          <IpList
            visible={this.state.view.iplist}
            iplist={this.state.iplist}
            iplist_add={this.state.iplist_add}
            iplist_del={this.state.iplist_del}
            onAdd={ip => this.addIp(ip)}
            onDelete={ip => this.deleteIp(ip)}
          />

          <Sidebar.Pusher className="chartContainer" dimmed={!!this.state.view.loading}>
            <Chart
              grouped={this.state.group.enabled}
              stacked={this.state.view.stacked}
              data={this.state.data.result}
              keys={this.state.filter.keys}
              func={this.state.group.func.selected}
              field={this.state.group.field.selected}
              period={this.state.group.period.selected}
              query={this.state.data.query}
            />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
