import React, { Component } from 'react';
import AddQuestion from '../components/admin/AddQuestion'



export default class Admin extends Component {
    addQuestion(data){
        console.log(data)
    }
    render() {

        return (
            <div>   
            <h1>    Admin dashboard</h1>
            <p>the admin will define the messages that will be showed to the users, he will also define the params such as the time between the question and answer ...</p>
            <p>So we will start by defining 5 indications and an answer - admin can see the list of existing questions (read from DB)- 
            Admin can Add a question to the database :  we have a fixed number of 'indice' and an answer </p>
            <h1>Add a Question to the dataBase</h1>
            <AddQuestion onSubmit={this.addQuestion.bind(this)}/>

            </div>
        )
    }
}
