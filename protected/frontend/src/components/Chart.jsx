import { Header } from 'semantic-ui-react';
import {
  LineChart,
  BarChart,
  AreaChart,
  Bar,
  Area,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import React from 'react';
import md5 from 'md5';

export default class Chart extends React.Component {

  constructor(props) {
    super(props);
  }

  getChartColor(x) {
    return "hsl(" + x  + ", 100%, 40%)";
  }

  getChartColorByKey(key) {
    let hashkey = md5(key);
    let hash = 0;
    if (hashkey.length === 0) return this.getChartColor(0);
    for (let i = 0; i < hashkey.length; i++) {
      let chr = hashkey.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return this.getChartColor(hash);
  }

  render() {
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
          <BarChart data={data} barGap={0} barCategoryGap={1}>
            {keys.map(key =>
              <Bar
                key={key}
                stackId={this.props.stacked ? 'a': undefined}
                dataKey={key}
                fill={this.getChartColorByKey(key)} />
            )}
            <XAxis dataKey={this.props.period}/>
            <YAxis domain={[this.props.logscale ? 0.5 : 0, 'dataMax']} scale={this.props.logscale ? 'log' :'linear'}/>
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

    if(this.props.stacked){
      return (<ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          {keys.map(key => <Area type={this.props.smooth ? "monotone" : "linear"} key={key} stackId="1" dataKey={key} stroke={this.getChartColorByKey(key)} fill={this.getChartColorByKey(key)}/>)}
          <XAxis dataKey="date"/>
          <YAxis domain={[0, 'dataMax']} scale={'linear'}/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>);
    }else {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {keys.map(key => <Line type={this.props.smooth ? "monotone" : "linear"} key={key} dataKey={key} stroke={this.getChartColorByKey(key)}/>)}
            <XAxis dataKey="date"/>
            <YAxis domain={[0, 'dataMax']} scale={'linear'}/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }
}