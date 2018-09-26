const mongoose = require('mongoose');
const Service = require('./index.js');

var addService = function(service, cb) {
  let serviceInstance = new Service({
    userName: service.userName,
  	userId: service.userId,
    zip: service.zip,
    subject: service.subject,
    text: service.text,
    status: service.status,
    fulfillerId: service.fulfillerId,
    fulfillerName: service.fulfillerName
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

var getServiceById = function(id, cb) {
  var id = mongoose.Types.ObjectId(id);
  Service.find({'_id': id}, function(err, data) {
    if (err) return handleError(err);
    cb(data[0]);
  })
}

var updateService = function(id, updateParams, cb) {
  if (id.length !== 24) {
    cb(0);
  }
  var id = mongoose.Types.ObjectId(id);
  Service.findByIdAndUpdate(id, updateParams, {new: true}, function(err, data) {
    if (err) return handleError(err);
    cb(data);
  })
}

var deleteService = function(id, cb) {
  if (id.length !== 24) {
    cb(0);
  }
  var id = mongoose.Types.ObjectId(id);
  Service.deleteOne({_id: id}, function(err, data) {
    if (err) console.log(err);
    cb(data, id);
  })
} 

var getservicesByUserId = function(id, cb) {
  Service.find({'userId': id}, function(err, data) {
    if (err) return handleError(err);
    cb(data);
  })
}

var getservicesByFulfillerId = function(id, cb) {
  Service.find({'fulfillerId': id}, function(err, data) {
    if (err) return handleError(err);
    cb(data);
  })
}

var getservicesByStatus = function(zip, status, cb) {
  Service.find({'zip': zip, 'status': status}, function(err, data) {
    if (err) return handleError(err);
    cb(data);
  })
}
module.exports = {
  addService: addService,
  getServicesByZip: getServicesByZip,
  getServiceById: getServiceById,
  updateService: updateService,
  deleteService: deleteService,
  getservicesByUserId: getservicesByUserId,
  getservicesByFulfillerId: getservicesByFulfillerId,
  getservicesByStatus: getservicesByStatus
}