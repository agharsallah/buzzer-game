var controller = require ('./controller/question')

var router = function router(app, apiRoutes) {
  app.use('/api', apiRoutes);
  apiRoutes.post('/addquestion', controller.addQuestion); //add a question to the db
  apiRoutes.get('/question-number', controller.questionNumber); //number of existig questions
  apiRoutes.get('/question-list', controller.questionList); //list of questions
}

exports.default = router;