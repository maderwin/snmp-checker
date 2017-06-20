import React, { Component } from 'react';
import Axios from 'axios';
import { Label, Sidebar, Segment, Menu, Icon} from 'semantic-ui-react'
import Swipeable from 'react-swipeable'
import Filter from './Filter';
import Chart from './Chart';
import IpList from './IpList';
import moment from 'moment';

import 'semantic-ui-css/semantic.min.css';

const rootUrl = 'http://stud-dev.asu.ru/wifi';

export default class App extends Component {
  constructor(){
    super();

    this.state = {
      view: {
        sidebar: false,
        iplist: false,
        stacked: false,
        smooth: false,
        normalize: false,
        logscale: false,
        loading: 0
      },
      group: {
        enabled: false,
        field: {
          selected: 'both',
          options: [
            {key: 'both', value: "both", text:"IP+SSID"},
            {key: 'ip', value: "ip", text:"Only IP"},
            {key: 'ssid', value: "ssid", text:"Only SSID"}
          ]
        },
        period: {
          selected: 'latest',
          options: [
            {key: 'latest', value: 'latest', text:"Do not group"},
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
        start: moment(),
        end: moment(),
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

    setInterval(()=>{
      this.updateData(this.buildQuery());
    }, 5 * 60 * 5000);
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
      state.view.iplist = !state.view.iplist;
      state.view.sidebar = false;
    });

    this.fetchIpList();
  }

  swipeLeft() {
    if(!this.state.view.iplist) {
      this.setState((state) => {
        state.view.sidebar = false;
        state.view.iplist = false;
      });
    }
  }

  swipeRight() {
    if(!this.state.view.iplist) {
      this.setState((state) => {
        state.view.sidebar = true;
        state.view.iplist = false;
      });
    }
  }

  buildQuery(){
    let query = rootUrl + '/api.php?api=stat';
    if(this.state.group.enabled){
      query += '&period=' + this.state.group.period.selected;
    }else {
      query += '&period=latest';
    }
    query += '&field=' + this.state.group.field.selected;

    if(this.state.filter.start){
      query += '&start=' + this.state.filter.start.format('YYYY-MM-DD');
    }

    if(this.state.filter.end){
      query += '&end=' + this.state.filter.end.format('YYYY-MM-DD');
    }

    return query;
  }

  fetchIpList(){
    this.setState((state)=> {
      state.view.loading++;
      return state;
    });
    Axios.get(rootUrl + '/api.php?api=ip')
      .then(response => {
        this.setState((state) => {
          state.view.loading--;
          state.iplist = response.data;
          return state;
        })
      })
      .catch(() => {
        this.setState((state) => {
          state.view.loading--;
          return state;
        });
      });
  }

  deleteIp(ip){
    this.setState((state)=> {
      state.view.loading++;
      state.iplist_del = state.iplist_del.concat([ip]);
      return state;
    });
    Axios.get(rootUrl + '/api.php?api=ip&action=delete&ip=' + ip)
      .then(response => {
        this.setState((state)=> {
          state.view.loading--;
          state.iplist = response.data;
          state.iplist_del = state.iplist_del.filter(item=>item!==ip);
          return state;
        });
    })
      .catch(() => {
        this.setState((state)=> {
          state.view.loading--;
          state.iplist_del = state.iplist_del.filter(item=>item!==ip);
          return state;
        });
      });
  }

  addIp(ip){
    this.setState((state)=> {
      state.view.loading++;
      state.iplist_add = state.iplist_add.concat([ip]);
      return state;
    });
    Axios.get(rootUrl + '/api.php?api=ip&action=add&ip=' + ip)
      .then(response => {
        this.setState((state)=> {
          state.view.loading--;
          state.iplist = response.data;
          state.iplist_add = state.iplist_add.filter(item=>item!==ip);
          return state;
        });
      })
      .catch(() => {
        this.setState((state)=> {
          state.view.loading--;
          state.iplist_add = state.iplist_add.filter(item=>item!==ip);
          return state;
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
      <Swipeable
        onSwipingLeft={() => this.swipeLeft()}
        onSwipingRight={() => this.swipeRight()}
        className="App">
        <Menu className='top attached' inverted color="blue">
          <Menu.Item
            active={this.state.view.sidebar}
            onClick={() => this.toggleSidebar()}>
            <Icon name='options' />
            Filter
          </Menu.Item>
          <Menu.Item
            onClick={() => this.updateData(this.buildQuery())}>
            <Icon
              name='refresh'
              loading={!!this.state.view.loading}
            />
            Update
            <Label size="small" color="blue" basic>
              {this.state.view.loading}
            </Label>
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

          <Sidebar.Pusher className="chartContainer">
            <Chart
              grouped={this.state.group.enabled}
              stacked={this.state.view.stacked}
              logscale={this.state.view.logscale}
              normalize={this.state.view.normalize}
              smooth={this.state.view.smooth}
              data={this.state.data.result}
              keys={this.state.filter.keys}
              func={this.state.group.func.selected}
              field={this.state.group.field.selected}
              period={this.state.group.period.selected}
              query={this.state.data.query}
            />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Swipeable>
    );
  }
}
