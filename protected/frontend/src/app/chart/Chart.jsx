import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import {
  Grid,
  Col,
  ListGroup,
  ListGroupItem,
  Checkbox
} from 'react-bootstrap';
import React from 'react';
import axios from 'axios';

import './Chart.css';

export class Chart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      points: [],
      mean: []
    }
  }

  componentDidMount() {
    axios.get(this.props.rootUrl + '/stat/mean.json')
      .then(res => {
        const ipList = [];

        const mean = res.data
          .reduce((mean, current) => {
            if (!mean[current.hour]) {
              mean[current.hour] = {
                name: current.hour + ':00'
              };
            }
            if (ipList.indexOf(current.ip) === -1) {
              ipList.push(current.ip);
            }
            mean[current.hour][current.ip] = +current.users;

            return mean;
          }, [])
          .map((currentHour) => {
            ipList.foreach((currentIp) => {
              if (!currentHour[currentIp]) {
                currentHour[currentIp] = 0;
              }
            });
            return currentHour;
          });


        const points = res.data.map(current => current.ip)
          .filter((val, i, self) => self.indexOf(val) === i)
          .map(current => ({ip: current, active: true}));

        this.setState({points, mean});
      });
  }

  getChartColor(x) {
    return "hsl(" + x * 360 + ", 100%, 30%)";
  }

  getChartColorByIp(ip) {
    for (let i = 0; i < this.state.points.length; i++) {
      if (this.state.points[i].ip === ip) {
        return this.getChartColor(i / this.state.points.length);
      }
    }
    return this.getChartColor(0);
  }

  switchPoint(ip) {
    this.setState(state => {
      state.points.map(point => {
        if (point.ip == ip) {
          point.active = !point.active;
        }
        return point;
      });
      return state;
    });
  }

  render() {
    console.log(this.state);
    return (
      <section className="Chart">
        <Grid fluid>
          <Col xs={12} sm={9} md={10} lg={10}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={this.state.mean}>
                {this.state.points.filter(current => current.active).map(point =>
                  <Line type="monotone" key={point.ip} dataKey={point.ip} stroke={this.getChartColorByIp(point.ip)}/>
                )}
                <XAxis dataKey="name"/>
                <YAxis domain={['auto', 'auto']}/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Col>
          <Col xs={12} sm={3} md={2} lg={2}>
            <ListGroup>
              {this.state.points.map(point =>
                <ListGroupItem
                  key={point.ip}
                  bsStyle={point.active ? 'success' : 'danger'}>
                  <Checkbox inline checked={point.active} onChange={() => this.switchPoint(point.ip)}>
                    {point.ip}
                  </Checkbox>
                </ListGroupItem>
              )}
            </ListGroup>
          </Col>
        </Grid>
      </section>
    );
  }
}