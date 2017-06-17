import { Header } from 'semantic-ui-react';
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
// import {
//   Grid,
//   Col,
//   ListGroup,
//   ListGroupItem,
//   Checkbox
// } from 'react-bootstrap';
import React from 'react';
// import axios from 'axios';

export default class Chart extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
  }

  getChartColor(x) {
    return "hsl(" + x * 360 + ", 100%, 30%)";
  }

  getChartColorByKey(key) {
    key = '' + key;
    let hash = 0;
    if (key.length === 0) return this.getChartColor(0);
    for (let i = 0; i < key.length; i++) {
      let char = key.charCodeAt(i);
      hash = (hash+char) % 256;
    }
    return this.getChartColor(hash / 256);
  }

  render() {
    console.log(this.props);

    if(!this.props.query){
      return null;
    }

    if(!!this.props.error){
      return (
        <Header>Something wrong happened</Header>
      );
    }

    if(this.props.grouped){
      let data = this.props.data[this.props.func];
      let keys = this.props.data.keys;

      if(this.props.keys.length){
        keys = keys.filter(key => this.props.keys.indexOf(key) > -1);
      }

      return data && keys && data.length && keys.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            {keys.map(key =>
              <Bar
                key={key}
                stackId={this.props.stacked ? 'a': undefined}
                dataKey={key}
                fill={this.getChartColorByKey(key)} />
            )}
            <XAxis dataKey={this.props.period}/>
            <YAxis domain={['auto', 'auto']}/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      ) : null;
    }

    let data = this.props.data[this.props.field];
    let keys = this.props.data.keys;

    if(this.props.keys.length){
      keys = keys.filter(key => this.props.keys.indexOf(key) > -1);
    }

    console.log(keys);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {keys.map(key => <Line type="monotone" key={key} dataKey={key} stroke={this.getChartColorByKey(key)}/>)}
          <XAxis dataKey="date"/>
          <YAxis domain={['auto', 'auto']}/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}