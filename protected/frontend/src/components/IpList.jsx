import React, { Component } from 'react';
import { Sidebar, Menu, Icon, Input} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

export default class IpList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ip: ''
    };
  }

  changeIp(ip){
    this.setState({ip: ip});
  }

  addIp(ip){
    if(!!this.state.ip) {
      this.setState({ip: ''});
      this.props.onAdd(ip);
    }

  }

  deleteIp(ip){
    this.props.onDelete(ip);
  }

  render() {

    return (
      <Sidebar
        as={Menu}
        animation='scale down'
        width='wide'
        direction='right'
        visible={this.props.visible}
        vertical
      >
        {
          this.props.iplist
            .map(ip => {
              if(this.props.iplist_del.indexOf(ip) > -1) {
                return (<Menu.Item>
                  <Icon name='spinner' color="gray" loading={true}/>
                  {ip}
                </Menu.Item>);
              }else{
                return (<Menu.Item>
                  <Icon name='close' color="red" link={true} onClick={()=>this.deleteIp(ip)}/>
                  {ip}
                </Menu.Item>);
              }
            })
        }
        {
          this.props.iplist_add
            .map(ip => {
              return (<Menu.Item>
                <Icon name='spinner' color="gray" loading={true}/>
                {ip}
              </Menu.Item>);
            })
        }
        <Menu.Item>
          <Input
            placeholder='xxx.xxx.xxx.xxx'
            value={this.state.ip}
            transparent
            onChange={(e,data) => this.changeIp(data.value)}
            onKeyPress={(e) => {if(e.key === 'Enter') this.addIp(this.state.ip)}}
            icon={
              <Icon
                name='plus'
                link
                onClick={()=>this.addIp(this.state.ip)}
              />
            }
          />
        </Menu.Item>

      </Sidebar>
    );
  }
}
