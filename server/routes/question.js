var bodyparser = require('body-parser');

module.exports = function(router) {
  router.use(bodyparser.json());

  // query DB for ALL messages
  router.get('/questions', function(req, res) {
    console.log('Question Get from the Data BAse');
    res.end();
/*   firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  }); */

  });

 
}
