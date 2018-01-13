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
//adding Question
exports.addQuestion= function addQuestion(req, res, next) {
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

//adding Params
exports.addParam= function addParam(req, res, next) {
  console.log(req.body);
  console.log(req.body.gameParams);
  var Time=parseInt(req.body.Time) 
  var Player_number=parseInt(req.body.Player_number) 
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {  
      database.ref('param/').set(
        req.body.gameParams
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



//get the list of the questions
exports.questionList= function questionList(req, res, next) {  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      database.ref("questions").once("value", function(snapshot) {
        var questionList = Object.keys(snapshot).map(function (key) { return snapshot[key]; });
        questionList = shuffleArray(questionList);
        res.json(questionList);
        //res.set("Connection", "close");
      })

    }
  })
}
exports.sayHelloInEnglish = function() {
  firebase.auth()
  return database.ref("questions").once("value", function(snapshot) {
      
    //var questionList = Object.keys(snapshot).map(function (key) { return snapshot[key]; });
    //questionList = shuffleArray(questionList);
    //console.log("snapshot",snapshot.val());
    //I've tried to return the res here but no chance cause of the asynchronous behaviour
    var res = snapshot.val()
   
  })
};
        

/* suffle array */
function shuffleArray(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}