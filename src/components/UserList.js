import React, { Component } from 'react';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

export default class UserList extends Component {
    
    componentWillMount() {
        this.props.socket.on('updateScore', (score) => {
            this.setState({score});
        })
    }
    constructor(props){
      super(props);
      this.state={score:'0'}
    }
    render() {
        const userlistElement = []
        const userlist = this.props.userlist
        const usernums = Object.keys(userlist).length

        for(let uid in userlist) {
            const [ username, sex ] = [ userlist[uid].username, userlist[uid].sex ]
            const listbkColor = '#99BBFF'
            const avatarbkColor ='#CCDDFF'

            userlistElement.push(<ListItem style={{ backgroundColor: listbkColor }}  key={ uid } leftAvatar={ <Avatar backgroundColor={ avatarbkColor }> { username[0] } </Avatar> }  primaryText={ 'User :'+username }  />)
        }

        return(
            <div>
                <Subheader>
                    { `Online Users: ${usernums}`  }
                </Subheader>
                <List>
                    { userlistElement  }
                </List>
            </div>
        )
    }
}