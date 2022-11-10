/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var xhub = require('express-x-hub');
//var request = require('request');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());
var token = process.env.TOKEN || 'token';
var received_updates = [];

app.get('/', function(req, res) {
  console.log(req);
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
  console.log('array length is: '+received_updates.length)
});

app.get(['/facebook', '/instagram'], function(req, res) {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

app.post('/facebook', function(req, res) {
  console.log('Facebook request body:', req.body);
console.log('testing 1 2 3 !!!');
  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  console.log('request header X-Hub-Signature validated');
  // Process the Facebook updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.post('/instagram', function(req, res) {
  console.log('Instagram request body:');
  console.log(req.body);
  // Process the Instagram updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});


//=======
/*
var data = { 
  "messaging_product": "whatsapp",
  "to": "919099290487",
  "type": "template",
  "template": {"name": "hello_world", "language":{"code":"en_US"}}
 }

var options = {
  method: 'POST',
  body: data,
  url: 'https://graph.facebook.com/v15.0/107168948869617/messages',
  headers: {
    'Authorization':'Bearer EAAHTSBUHpucBAJ35Jb1VvJAS2HKbzriCAOh0PReOXJcGwPQjZAcoY4GTF2Mitu4FgbkE5Y3heR18fTFvZBiVoZAjO1c7JJMiXmNdaZC8X9eLrMByyBT7fzUQeNXR2KSSVtOROmp4rDz0DK5fcQKc7MuFl7ZCFecUEeHyq2NrmQkIUP0Pnw3ZBUBz8mrHFGq1ghvzNdbmoSEhjTGmyYm0v6'
  }
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
}
//call the request

request(options, callback);
//=====

*/


app.listen();
