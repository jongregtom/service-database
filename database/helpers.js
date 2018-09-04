const mongoose = require('mongoose');
const Service = require('./index.js');

var addService = function(service, cb) {
  let serviceInstance = new Service({
  	userId: service.userId,
    zip: service.zip,
    subject: service.subject,
    text: service.text,
    status: service.status,
    fulfillerId: service.fulfillerId
  })
  serviceInstance.save(function(err) {
    if (err) return handleError(err);
    cb(serviceInstance)
  })
}

var getServicesByZip = function(zip, cb) {
  if (typeof zip == Number) {
  	let zip = zip.toString();
  }
  Service.find({'zip': zip}, function(err, data) {
  	if (err) return handleError(err);
    cb(data);
  })
}

module.exports = {
  addService: addService,
  getServicesByZip: getServicesByZip
}