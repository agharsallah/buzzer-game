import React, { Component } from 'react';
import AddQuestion from '../components/admin/AddQuestion'
import axios from 'axios' ;
//var conf = require('../../configs/conf.js');
import { ToastContainer, toast } from 'react-toastify';
import {reset} from 'redux-form';

import { connect } from "react-redux";
import { refreshform } from "../actions/actionCreators";
import { bindActionCreators } from "redux";

class Admin extends Component {
    constructor(props){
      super(props);
      this.state={questionNumber:0,open: false}
    }
    notify = () => {var options={type: toast.TYPE.SUCCESS};toast("Question added to DB !",options)};
    
    //function ti get the number of question
    requestQuestionNumber(self){
        let url = 'http://localhost:3030/api/question-number';    
        axios({
          method: 'get',
          url: url
        })
        .then(function (response) {
            console.log('dammmmmn');
            console.log(response.data);
          self.setState({questionNumber:response.data});
        })
        .catch(function (error) {
          console.log(error);
        }); 
    }
    componentWillMount() {
        //we get the number of the questions
        this.requestQuestionNumber(this)
        
    }

    addQuestion(data){
        console.log(data)
        //when we get the object of the question we send it to the database through an Api
        let url = 'http://localhost:3030/api/addquestion';    
        const self = this
        axios({
          method: 'post',
          url: url,
          data: {
            question: data,
            number: this.state.questionNumber
          }
        })
        .then(function (response) {
            console.log("response");
            //should refresh the page here and inform the user that the question is added and get the number of the question updated again
            self.notify()
            self.props.refreshform()
            
            //update the bumber of question by calling the api
            self.requestQuestionNumber(self);
        

        })
        .catch(function (error) {
          console.log(error);
        });
        
    }
    render() {

        return (
            <div>   
            <h1>    Admin dashboard</h1>
            <p>the admin will define the messages that will be showed to the users, he will also define the params such as the time between the question and answer ...</p>
            <p>So we will start by defining 5 indications and an answer - admin can see the list of existing questions (read from DB)- 
            Admin can Add a question to the database :  we have a fixed number of 'indice' and an answer </p>
            <h1>Add a Question to the dataBase</h1>
            <AddQuestion  onSubmit={this.addQuestion.bind(this)}/>
            <ToastContainer autoClose={2500} type='success' />
            
            </div>
        )
    }
}
function mapDispatchToProps(dispatch) {
    // Whenever getPopValue is called, the result shoudl be passed
    // to all of our reducers
    return bindActionCreators({ refreshform }, dispatch);
  }
  function mapStateToProps(state) {
  
    //console.log("data from general state",state);
   
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Admin);
  