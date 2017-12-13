import React, { Component } from 'react';

import RaisedButton  from "material-ui/RaisedButton";

import Messages from '../components/Messages';
import MessageInput from '../components/MessageInput';
import UserList from '../components/UserList';
import ReactCountdownClock from 'react-countdown-clock' ;

import axios from 'axios' ;

export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state={table:'ready'}        
    }
    /* random array */

    componentWillMount() {
        //we will get the list of the questions here  then when we have the table ready 
        //we announce 3 Rounds - Round 1 - we show the Question , and a 2 min timer starts 
        /* let url = 'http://localhost:3030/api/question-list';   
        let self = this; 
        axios({
          method: 'get',
          url: url
        })
        .then(function (response) {
            var questionList = Object.keys(response.data).map(function (key) { return response.data[key]; });
            console.log(questionList);
            
            var res=self.shuffleArray(questionList)
            console.log(res);

          self.setState({questionList});
        })
        .catch(function (error) {
          console.log(error);
        });  */
    }
    
    componentDidMount() {
        const socket = this.props.socket

        socket.on('enterUser', username => {
            this.props.actions.updateMessages({ type: 'ENTER_MESSAGE', username: username })
        })

        socket.on('leaveUser', username => {
            this.props.actions.updateMessages({ type: 'LEAVE_MESSAGE', username: username })
        })

        socket.on('updateUserList', userlist => {
            this.props.actions.updateUserList(userlist)
        })

        socket.on('updateMessages', messages => {
            this.props.actions.updateMessages(messages)
        })

        socket.on('full', messages => {
            console.log(messages);
            this.setState({table:messages});
        })

        socket.on('GameStarts', messages => {
            console.log(messages);
            this.setState({table:messages});
        })
        //when we get the list of questions
        socket.on('questionList',questionList=>{
            console.log('questionList',questionList);
        })
    }

/*     handleChangeComplete = color => {
        this.props.actions.changeMessageBoxColor(color.hex)
    } */

    handleLeaveChatRoom() {
        this.props.socket.emit('leave', this.props.uid)
        this.props.actions.leaveChatRoom()
        location.reload()
    }

    handleClearMessages() {
        this.props.actions.clearMessages()
    }
    handleAnswer(){
        console.log('clicked');
    }
    handleCounterEnd(){
        console.log('CounterEnded');
    }
    render() {
        var usernums = Object.keys(this.props.userlist).length     
        console.log(this.state.table);   
        return(
            <div>
            {this.state.table=='full'? <div>full</div> :<div>
                <div className="chatroom-container">
                    <div className="chatroom-left-block">
                        <div className="chatroom-userlist">
                            <UserList userlist={ this.props.userlist } />
                        </div>
                    </div>
                    <div className="chatroom-right-block">
                        <div className="chatroom-otherfn">
                            <RaisedButton className="chatroom-otherfn-leave" label="Leave Room" primary={ true } onClick={ this.handleLeaveChatRoom.bind(this) } />
                            <RaisedButton className="chatroom-otherfn-clear" label="Clear" primary={ true } onClick={ this.handleClearMessages.bind(this) } />
                        </div>
                        <div className="chatroom-messages">
                            <div>
                                {this.state.table=='GameStarts'?
                                <ReactCountdownClock seconds={60}
                                color="#000"
                                alpha={0.9}
                                size={300}
                                onComplete={this.handleCounterEnd.bind(this)} />:null }
                            </div>
                            </div>

                        <RaisedButton className="chatroom-otherfn-leave" label="Answer" primary={ true } onClick={ this.handleAnswer.bind(this) } />
                        
                    </div>
                </div>
                <div className="chatroom-footer">

                    <div className="chatroom-right-block">
                        <div className="chatroom-message-input">
                            <MessageInput { ...this.props } />
                        </div>
                    </div>
                </div>
                </div>  }
            </div>
            
        )
    }
}