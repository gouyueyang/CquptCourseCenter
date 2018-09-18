var BluMUI = require('../libs/blueMonUI.js');
var ajax=require('../libs/post_ajax.js');

let config={
  user_id:'0110',
  course_id:'A1100020'
}

BluMUI.result.config=config;

BluMUI.create({
  id:'Nav'
  },
  'CreateNav',
  document.getElementById('React_left')
);




