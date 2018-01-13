var path = require('path');
var port = process.env.PORT || 3030;
var express = require('express');
var app = express();
var webpack = require('webpack');
var config = require('./configs/webpack.config.dev');
var conf = require('./configs/conf.js');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var compiler = webpack(config);
var mode = process.env.NODE_ENV;
var bodyParser = require('body-parser');
var controller = require('./server/controller/question')

//var firebase = require("firebase");

var router = require('./server/router'); // get our config file

const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '100mb' }));
//connect to the database
/* firebase.initializeApp(conf.firebaseConf);
var database = firebase.database(); */



if (mode === 'production') {
    app.use(express.static('dist'));
    app.get('/', function (req, res, next) {
        res.set('content-type', 'text/html');
        res.sendFile(path.join(__dirname, './dist/index.html'));
    });
} else {
    app.use(cors());
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler, {
        path: '/__webpack_hmr',
        heartbeat: 2000
    }));

    /* Api Routes Config */
    var apiRoutes = express.Router();

    router.default(app, apiRoutes);

    //const questionRouter = express.Router();
    //require('./server/routes/question')(questionRouter);
    //app.use('/api', questionRouter);


    app.get('*', function (req, res, next) {
        var filename = path.join(compiler.outputPath, 'index.html');
        compiler.outputFileSystem.readFile(filename, function (err, result) {
            if (err) {
                return next(err);
            }
            res.set('content-type', 'text/html');
            res.send(result);
            res.end();
        });
    });

}

var userList = {};

io.on('connection', function (socket) {
    var socketID = socket.id;
    //console.log(Object.keys(userList).length);
    socket.on('enter', function (info) {
        //console.log(info);

        userList[socketID] = {username:info.username,score:0};//[{username:'123',score:'0'}]
        //console.log(userList[socketID]);
        //console.log(userList[socketID].username);
        if (Object.keys(userList).length <= 2) {
            socket.emit('uid', socketID);
            socket.broadcast.emit('enterUser', userList[socketID].username);
            io.emit("updateUserList", userList);
            if (Object.keys(userList).length == 2) {

                //io.emit("questionList", [{ indice1: 'a', indice2: 'b', indice3: 'c', answer: 'j' }, { indice1: 'a2', indice2: 'b2', indice3: 'c2', answer: 'j' }]);
                io.emit("GameStarts", 'GameStarts');

                //get the questionList from the db and send them to clients
                // var a = controller.questionListSocket();
                //console.log(controller.questionListSocket);
                // console.log(controller.questionListSocket()); 
                //console.log('aaaaaaaaaaa',  }));


            }
            controller.sayHelloInEnglish().then(token => {
                let questionList = token.val().filter(function (n) { return n != undefined })
                io.emit("questionList", questionList);
                //io.emit("GameStarts", 'GameStarts');


                //if we get a Buzzer click from a user we treat it here 
                socket.on('answerTry', function (data) {
                    console.log('server butt clicked');
                    //console.log('data.questionNumber : ', data.questionNumber);
                    io.emit('buzzerClicked', "this is sent for the users to start a new counter -duration of answer ");
                    socket.broadcast.emit('noAnswer', "this is sent for the one who didn't clicked so he won't get the answer input in his view");

                    //treat the answer of the user 
                    let answer = questionList[data.questionNumber].answer

                    // get the info of the user who answers the question : id of the user | false or wrong
                    socket.on('updateMessages', function (info) {  
                        console.log('dddddddddddddddddddddddddddddddddddddddd'); 
                        console.log(info.content);
                        console.log(answer);
                        if (info.content == answer) {
                            //update the score of the user , 
                            userList[socketID].score= parseInt(userList[socketID].score)+1;

                            //send the score to the UI & move to the next question 
                            io.emit('correctAnswer', parseInt(data.questionNumber) + 1);
                            socket.emit('updateScore',userList[socketID].score);
                            //

                        } else {
                            //block the user and move on to the next question for other users
                            io.emit('wrongAnswer', " ");

                        }
                    })
                })

            })
        } else {
            socket.emit('full', 'full');
        }
    });


    /*     socket.on('updateMessages', function (messages) {
            io.emit('updateMessages', messages);
        }) */

    socket.on('leave', function (uid) {
        if (userList.hasOwnProperty(uid)) {
            socket.broadcast.emit('leaveUser', userList[uid].username);
            delete userList[uid];
        }

        socket.broadcast.emit("updateUserList", userList);
        socket.disconnect(true);
    });

    socket.on('disconnect', function () {
        if (userList.hasOwnProperty(socketID)) {
            socket.broadcast.emit('leaveUser', userList[socketID].username);
            delete userList[socketID];
        }

        socket.broadcast.emit("updateUserList", userList);
    });
});

server.listen(port, function (err) {
    console.log('Listening port:' + port);
});
