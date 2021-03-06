const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/helpers.js');
const PORT = process.env.port || 3000;

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
  db.getServicesByUserId(id, (data) => {
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

app.listen(PORT, () => console.log(`listening on port ${PORT}!`))

