const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/helpers.js');
const PORT = process.env.port || 3000;
const request = require('request');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
   return next();
});

//for testing connection only
app.get('/', function(req, res) {
  res.send('Welcome to the Service Database!')
  res.end();
})

//add service request to DB
app.post('/service', function(req, res) {
  var service = req.body;
  db.addService(service, (data) => {
    res.send('service request saved to DB : ' + data);
  })
})

//get all service requests by zip code
app.get('/servicesByZip', function(req, res) {
 var zip = req.query.zip; 
 db.getServicesByZip(zip, (data) => {
 	res.send(data);
 	res.end();
 })
})

//get service request by Id
app.get('/serviceById/:id', function(req, res) {
  db.getServiceById(req.params.id, (data) => {
    res.send(data);
    res.end();
  })
})

//update service by Id ..../service/id?status=fulfilled...
app.get('/service/:id', function(req, res) {
  var id = req.params.id;
  var updateParams = req.query;
  db.updateService(id, updateParams, (data) => {
  	if (data === 0) {
  	  res.send('invalid service ID');
  	  res.end();
  	}
    if (updateParams.status === 'Completed') {
      var userId = data.userId;
      console.log('data', userId)
      request(`https://uiwr3rzqge.execute-api.us-east-2.amazonaws.com/default/karma-points_put?id=${userId}`, (err, res, body) => {
      if (err) {console.log(err)}
        console.log('body', body);
      })
    }
  	res.send('service updated successfully: ' + data);
  	res.end();
  })
})

//delete service by Id, sends back deleted service
app.get('/delete/:id', function(req, res) {
  var id = req.params.id;
  db.deleteService(id, (data) => {
  	if (data === 0) {
  	  res.send('invalid Service ID');
  	  res.end();
  	} else if (data.n === 0) {
  	  res.send('No service deleted; could not find service ID: ' + id);
  	  res.end();
  	} else {
  	  res.send(data.n + ' service deleted; service ID: ' + id)
  	  res.end();
  	}
  	// res.send(data);
  	// res.end();
  })
})

app.get('/servicesByUserId', function(req, res) {
  var id = req.query.id; 
  console.log('userId', id, typeof id);
  db.getServicesByUserId(id, (data) => {
    console.log('data in server', data)
 	  res.send(data);
 	  res.end();
  })
})

app.get('/servicesByFulfillerId', function(req, res) {
  var id = req.query.id; 
  db.getServicesByFulfillerId(id, (data) => {
 	res.send(data);
 	res.end();
  })
})

app.get('/servicesByStatus/:zip', function(req, res) {
  var zip = req.params.zip;
  var status = req.query.status;
  db.getServicesByStatus(zip, status, (data) => {
  	res.send(data);
  	res.end();
  })
})

app.post('/comment', function(req, res) {
  var comment = req.body;
  db.addComment(comment, () => {
    db.getCommentsByServiceId(comment.serviceId, (data) => {
      res.send(data);
    })

  })
})

app.get('/commentsByServiceId/:id', function(req, res) {
  var id = req.params.id;
  db.getCommentsByServiceId(id, (data) => {
  	res.send(data);
  })
})

app.get('/comment', function(req, res) {
  console.log('serviceId, commentId', req.query.serviceId, req.query.commentId)
  db.deleteComment(req.query.commentId, req.query.serviceId, () => {
   //  db.getCommentsByServiceId(req.query.serviceId, (data) => {
  	//   res.send(data);
  	// })
    console.log('hi')
  	res.end();
  })
})

app.listen(PORT, () => console.log(`listening on port ${PORT}!`))

