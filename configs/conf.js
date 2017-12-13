const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    port:'3000',
    apiUrl:'localhost:3030',
    firebaseConf:{
        apiKey: "AIzaSyCruGLAEeVw1JkqonmcOLhkD7JYZw3HWkU",
        authDomain: "buzzer-9a708.firebaseapp.com",
        databaseURL: "https://buzzer-9a708.firebaseio.com",
        projectId: "buzzer-9a708",
        storageBucket: "buzzer-9a708.appspot.com",
        messagingSenderId: "745223636264"
      }
}