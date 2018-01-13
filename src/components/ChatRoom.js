import React, { Component } from 'react';

import RaisedButton from "material-ui/RaisedButton";

import Messages from '../components/Messages';
import MessageInput from '../components/MessageInput';
import UserList from '../components/UserList';
import ReactCountdownClock from 'react-countdown-clock';
import './roomStyle.css'
import axios from 'axios';

export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: 'ready', questionList: [], pauseQuestion: false, answermode: false, noAnswer: false, secondsElapsed: 0, questionNum: 0, indiceNum: 1, answer: '', score: 0,
            buzzer_body: 'body', buzzer_top: '', buzzer_bottom: ''
        }
    }
    /* random array */
    tick() {
        this.setState({ secondsElapsed: this.state.secondsElapsed + 1 });
    }
    componentWillMount() {
        //we will get the list of the questions here  then when we have the table ready 
        //we announce 3 Rounds - Round 1 - we show the Question , and a 2 min timer starts 
        /* let url = 'http://localhost:1515/api/question-list';   
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
            //console.log(messages);
            this.setState({ table: messages });
        })

        socket.on('GameStarts', messages => {
            //console.log(messages);
            this.interval = setInterval(this.tick.bind(this), 1000);
            this.setState({ table: messages });
        })
        //when we get the list of questions ready we save them in the local state
        socket.on('questionList', questionList => {
            this.setState({ questionList });
            //console.log('questionList', questionList);
        })


    }
    componentWillUnmount() {
        clearInterval(this.interval);
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
    handleAnswer() {
        //this answer try gives the socket server the hand to perform the treatment of when buzzer is clicked
        //we also send the question number on wich the user have chosen to answer and the in which indice he decided to answer --to calculate score
        let info = { questionNumber: this.state.questionNum, indiceNum: this.state.indiceNum }
        this.props.socket.emit('answerTry', info)
        //this.props.socket.emit('checkAnswer',info )
    }
    handleBuzzerClick() {
        console.log('buzzerClicked');
        //we start a new timer
        this.setState({ secondsElapsed: 0, answermode: true, buzzer_body: 'body body-click', buzzer_top: 'top-click', buzzer_bottom: 'bottom-click' });
    }
    //no answer is to block the user when he 's not the one who clicked the buzzer
    handleNoAnswer(Bool) {
        this.setState({ noAnswer: Bool });// if true than we don't show the input answer
        //console.log(this.props.socket.uid);
    }
    handleCounterEnd() {
        console.log('CounterEnded');
    }
    restCounter(questionNum, indiceNum) {
        //console.log('dd');
        this.setState({ secondsElapsed: 0, questionNum, indiceNum });
    }
    handleCorrectAnswer() {
        this.setState({ answermode: false });
    }
    handleScore(score) {
        this.setState({ score: score });
    }
    changeButtonStyle() {
        this.setState({
            buzzer_body: 'body body-click', buzzer_top: 'top-click', buzzer_bottom: 'bottom-click'
        });
    }
    resetButton() {
        this.setState({
            buzzer_body: 'body ', buzzer_top: '', buzzer_bottom: ''
        });
    }
    render() {
        this.props.socket.on('buzzerClicked', () => {
            this.handleBuzzerClick()
        })
        //no answer function inorder to be able to show the answer input solamente for  the user who clicked the buzzer
        this.props.socket.on('noAnswer', () => {
            this.handleNoAnswer(true)
        })

        //updating score
        this.props.socket.on('updateScore', (score) => {
            console.log(score);
            console.log("dddddddddd");
            this.handleScore(score)
        })
        //handling a correct answer
        this.props.socket.on('correctAnswer', (questionNum) => {
            //moving to the next qustion 
            this.restCounter(questionNum, 1)
            //buzzer back to clickable
            this.resetButton();
            //go back to question mode
            this.handleCorrectAnswer()
            //hiding the input answer for the one who had it on 
            if (this.state.noAnswer == true) {
                this.handleNoAnswer(false)
            }

        })

        var usernums = Object.keys(this.props.userlist).length
        //console.log(this.state.table);//gamestarts
        //question=this.state.questionList
        var indice = 'indice' + [this.state.indiceNum]
        //console.log('shhhhhhhhhhhh', (this.state.questionList) );
        //console.log('indice', indice);
        //console.log('questionNum', this.state.questionNum);
        //console.log('questionList', this.state.questionList);
        if (this.state.questionList.length != 0) {
            //if we have a next question we shoot it
            var question = (this.state.questionList[this.state.questionNum])[indice];
            //show the theme
            var theme = (this.state.questionList[this.state.questionNum]).Question;
            console.log('-------------------------------', theme);
            //else we compare score & show the winner
        }
        //answermode will be true if the user clicks on the buzzer so we get to this block to loop through questions

        // every x seconds the questions change 
        if (this.state.secondsElapsed == 15 && this.state.questionList && this.state.answermode == false) {
            //change question and start the counter
            var indiceNum = this.state.indiceNum + 1;
            var questionNum = this.state.questionNum;
            if (this.state.indiceNum == 3) { var questionNum = this.state.questionNum + 1; var indiceNum = 0; }
            this.restCounter(questionNum, indiceNum)
        };

        //we get to this block when user clicked buzzer so that we the question answering timer will start
        if (this.state.answermode == true) {
            if (this.state.secondsElapsed < 15) {
                //console.log('go back to question mode after updating score ...');
                question = 'user  test is answering ...'

            } else {
                question = 'No Answer '
                //block the user & continue indication for other users
                //
            }
        }
        //console.log('noAnswer',this.state.noAnswer);
        return (
            <div>
                {this.state.table == 'full' ? <div>full</div> :
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-3 listuser' >
                                <UserList userlist={this.props.userlist} score={this.state.score} { ...this.props } />
                            </div>

                            <div className='col-md-9' style={{ marginTop: '1%' }}>
                                <div className='row '>
                                    <div className="well col-md-11 offset-1 "><h1 className='game-Title'>Question : {theme}</h1></div>
                                    <div className='row col-md-11 offset-1'>
                                        <div className='col-md-5 offset-1  well'> <h1 className='game-Title'>Time : {this.state.secondsElapsed}</h1> </div>
                                        <div className='col-md-5 offset-1  well'> <h1 className='game-Title'>Score : {this.state.score}</h1> </div>
                                    </div>
                                    <div className='col-md-11 offset-1  well'> <h1 className='game-Title'>Indication :{this.state.table == 'GameStarts' ?
                                        //if we have players show question and start counter 
                                        //for the first question in the first round
                                        <p>{question}</p>
                                        : null}</h1> </div>
                                </div>
                                <div className='col-md-12' style={{ marginTop: '10%' }}  >
                                    <div id="button" onClick={this.handleAnswer.bind(this)}>
                                        <div id="top" className={this.state.buzzer_top}></div>
                                        <div id="bottom" className={this.state.buzzer_bottom} ></div>
                                        <div id="body" className={this.state.buzzer_body}></div>
                                        <div id="floor"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="chatroom-right-block" style={{ marginTop: '5%' }} >
                                        {(this.state.answermode == true && this.state.noAnswer == false) ?
                                            <div className="chatroom-message-input">

                                                <MessageInput { ...this.props } />
                                            </div> : null}
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}