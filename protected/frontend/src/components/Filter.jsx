import React, { Component } from 'react';
import { Sidebar, Menu, Icon, Input, Dropdown, Checkbox} from 'semantic-ui-react';
import DatePicker from './DatePicker';
import moment from 'moment';

import 'semantic-ui-css/semantic.min.css';

export default class Filter extends Component {
  constructor(props){
    super(props);
    this.appState = this.props.state;
  }
  onStartDateChanged(date){
    this.appState.filter.start = date;
    this.props.onChange(this.appState);
  }
  onEndDateChanged(date){
    this.appState.filter.end = date;
    this.props.onChange(this.appState);
  }
  onToggleStacked(){
    this.appState.view.stacked = !this.appState.view.stacked;
    this.appState.view.logscale = false;
    this.props.onChange(this.appState);
  }
  onToggleSmooth(){
    this.appState.view.smooth = !this.appState.view.smooth;
    this.props.onChange(this.appState);
  }
  onToggleLogscale(){
    this.appState.view.logscale = !this.appState.view.logscale;
    this.appState.view.stacked = false;
    this.appState.view.normalize = false;
    this.props.onChange(this.appState);
  }
  onToggleNormalize(){
    this.appState.view.normalize = !this.appState.view.normalize;
    this.appState.view.logscale = false;
    this.props.onChange(this.appState);
  }
  onChangeField(data){
    this.appState.group.field.selected = data.value;
    this.props.onChange(this.appState);
  }
  onChangePeriod(data){
    this.appState.group.period.selected = data.value;
    this.appState.group.enabled = !!data.value && data.value !== 'latest';
    this.props.onChange(this.appState);
  }
  onChangeFunc(data){
    this.appState.group.func.selected = data.value;
    this.props.onChange(this.appState);
  }
  onChangeKeys(data){
    this.appState.filter.keys = data.value;
    this.props.onChange(this.appState);
  }

  render() {
    return (
      <Sidebar
        as={Menu}
        animation='scale down'
        width='wide'
        direction='left'
        visible={this.props.state.view.sidebar}
        vertical
      >
        <Menu.Item>
          <Input transparent fluid type='text'>
            <Icon name="calendar"/>
            <Icon name="angle right"/>
            <DatePicker
              value={this.props.state.filter.start}
              placeholder={moment().format('YYYY-MM-DD')}
              onChange={(date)=>this.onStartDateChanged(date)}
            />
          </Input>
        </Menu.Item>
        <Menu.Item>
          <Input transparent fluid type='text'>
            <Icon name="calendar"/>
            <Icon name="angle left"/>
            <DatePicker
              style={{flex: '1 0 auto'}}
              value={this.props.state.filter.end}
              placeholder={moment().subtract(1, 'week').format('YYYY-MM-DD')}
              onChange={(date)=>this.onEndDateChanged(date)}
            />
          </Input>
        </Menu.Item>
        <Menu.Item>
          <Dropdown
            placeholder='Filter by key'
            search={true}
            selection={true}
            fluid
            multiple
            options={!!this.props.state.data.result.keys ? this.props.state.data.result.keys.map(key => {return {
              key: key,
              value: key,
              text: key
            }}): []}
            onChange={(e, data)=>{this.onChangeKeys(data)}}
          />
        </Menu.Item>
        <Menu.Item>
          <Dropdown
            placeholder='Group by field'
            selection={true}
            value={this.props.state.group.field.selected}
            options={this.props.state.group.field.options}
            onChange={(e, data)=>{this.onChangeField(data)}}
            fluid
          />
        </Menu.Item>
        <Menu.Item>
          <Dropdown
            placeholder='Group by period'
            selection={true}
            value={this.props.state.group.period.selected}
            options={this.props.state.group.period.options}
            onChange={(e, data)=>{this.onChangePeriod(data)}}
            fluid
          />
        </Menu.Item>
        <Menu.Item>
          <Dropdown
            placeholder='Aggregate method'
            selection={true}
            disabled={!this.props.state.group.enabled}
            value={this.props.state.group.func.selected}
            options={this.props.state.group.func.options}
            onChange={(e, data)=>{this.onChangeFunc(data)}}
            fluid
          />
        </Menu.Item>
        <Menu.Item>
          <Checkbox
            slider={true}
            label='Stacked'
            checked={this.props.state.view.stacked}
            onChange={()=>{this.onToggleStacked()}}
          />
        </Menu.Item>
        <Menu.Item>
          <Checkbox
            slider={true}
            label='Log scale'
            disabled={!this.props.state.group.enabled}
            checked={this.props.state.view.logscale}
            onChange={()=>{this.onToggleLogscale()}}
          />
        </Menu.Item>
        <Menu.Item>
          <Checkbox
            slider={true}
            label='Smooth'
            disabled={this.props.state.group.enabled}
            checked={this.props.state.view.smooth}
            onChange={()=>{this.onToggleSmooth()}}
          />
        </Menu.Item>
        <Menu.Item>
          <Checkbox
            slider={true}
            label='Normalize'
            disabled={!this.props.state.view.stacked}
            checked={this.props.state.view.normalize}
            onChange={()=>{this.onToggleNormalize()}}
          />
        </Menu.Item>
      </Sidebar>
    );
  }
}
