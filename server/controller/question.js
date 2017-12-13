var bodyparser = require('body-parser');
var conf = require('../../configs/conf.js');

var firebase = require("firebase");
firebase.initializeApp(conf.firebaseConf);
var database = firebase.database();
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  console.log(errorCode,'---',errorMessage)
});
exports.addQuestion= function addQuestion(req, res, next) {
  console.log('req-----------');
  //console.log(req.body);
  var actualQuestionNumber=parseInt(req.body.number) + 1
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {  
      database.ref('questions/' + actualQuestionNumber ).set(
      req.body.question
      );
      res.json('added to db');
      
    }

  })

};

//get the number of existing questions
exports.questionNumber= function questionNumber(req, res, next) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      database.ref("questions").once("value", function(snapshot) {
        console.log("There is "+snapshot.numChildren()+" question");
         res.json(snapshot.numChildren());
        //res.set("Connection", "close");

      })
  
    }
  })

};


