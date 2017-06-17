import React, { Component } from 'react';
import { Sidebar, Menu, Icon, Input, Dropdown, Checkbox} from 'semantic-ui-react'
import DatePicker from './DatePicker';

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
    this.props.onChange(this.appState);
  }
  onChangeField(data){
    this.appState.group.field.selected = data.value;
    this.props.onChange(this.appState);
  }
  onChangePeriod(data){
    this.appState.group.period.selected = data.value;
    this.appState.group.enabled = !!data.value;
    this.props.onChange(this.appState);
  }
  onChangeFunc(data){
    this.appState.group.func.selected = data.value;
    this.props.onChange(this.appState);
  }
  onChangeKeys(data){
    console.log(data);
    this.appState.filter.keys = data.value;
    this.props.onChange(this.appState);
  }

  render() {
    return (
      <Sidebar
        as={Menu}
        animation='uncover'
        width='wide'
        direction='left'
        visible={this.props.state.view.sidebar}
        vertical
      >
        <Menu.Item>
          <Input transparent fluid type='text' >
            <Icon name="calendar"/>
            <Icon name="angle right"/>
            <DatePicker
              value={this.props.state.filter.start}
              onChange={(date)=>this.onStartDateChanged(date)}
            />
          </Input>
        </Menu.Item>
        <Menu.Item>
          <Input transparent fluid type='text' >
            <Icon name="calendar"/>
            <Icon name="angle left"/>
            <DatePicker
              value={this.props.state.filter.end}
              onChange={(date)=>this.onEndDateChanged(date)}
            />
          </Input>
        </Menu.Item>
        <Menu.Item>
          <Dropdown
            placeholder='Filter by key'
            search
            selection
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
            selection
            value={this.props.state.group.field.selected}
            options={this.props.state.group.field.options}
            onChange={(e, data)=>{this.onChangeField(data)}}
            fluid
          />
        </Menu.Item>
        <Menu.Item>
          <Dropdown
            placeholder='Group by period'
            selection
            value={this.props.state.group.period.selected}
            options={this.props.state.group.period.options}
            onChange={(e, data)=>{this.onChangePeriod(data)}}
            fluid
          />
        </Menu.Item>
        <Menu.Item>
          <Dropdown
            placeholder='Agregate method'
            selection
            disabled={!this.props.state.group.enabled}
            value={this.props.state.group.func.selected}
            options={this.props.state.group.func.options}
            onChange={(e, data)=>{this.onChangeFunc(data)}}
            fluid
          />
        </Menu.Item>
        <Menu.Item>
          <Checkbox
            slider
            label='Stacked'
            disabled={!this.props.state.group.enabled}
            checked={this.props.state.view.stacked}
            onChange={()=>{this.onToggleStacked()}}
          />
        </Menu.Item>

      </Sidebar>
    );
  }
}
