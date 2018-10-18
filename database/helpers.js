const mongoose = require('mongoose');
const Service = require('./index.js').Service;
const Comment = require('./index.js').Comment;

var addService = function(service, cb) {
  let serviceInstance = new Service({
    userName: service.userName,
    lastName: service.lastName,
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
  // if (id.length !== 24) {
  //   cb(0);
  // }
  var id = mongoose.Types.ObjectId(id);
  Service.findByIdAndUpdate(id, updateParams, {new: true}, function(err, data) {
    if (err) {console.log(err)};
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

var getServicesByUserId = function(id, cb) {
  Service.find({'userId': id}, function(err, data) {
    if (err) return err;
    console.log('data', data)
    cb(data);
  })
}

var getServicesByFulfillerId = function(id, cb) {
  Service.find({'fulfillerId': id}, function(err, data) {
    if (err) return handleError(err);
    cb(data);
  })
}

var getServicesByStatus = function(zip, status, cb) {
  Service.find({'zip': zip, 'status': status}, function(err, data) {
    if (err) return handleError(err);
    cb(data);
  })
}

var addComment = function(comment, cb) {
  //add +1 to messageCount in Service Model
  getServiceById(comment.serviceId, (service) => {
    var count = service.commentCount + 1;
    updateService(service._id, {commentCount: count}, (data) => {
      return;
    })
  })
  let commentInstance = new Comment({
    serviceId: comment.serviceId,
    userName: comment.userName,
    lastName: comment.lastName,
    userId: comment.userId,
    text: comment.text
  })
  //add comment to Comment Model
  commentInstance.save(function(err) {
    if (err) {console.log(err)};
    cb(commentInstance);
  })
}

var getCommentsByServiceId = function(id, cb) {
  Comment.find({'serviceId': id}, function(err, data) {
    if (err) return handleError(err);
    cb(data);
  })
}

var deleteComment = function(id, serviceId, cb) {
 Service.find({"_id": serviceId}, function(err, service) {
    console.log('service', service)
    if (err) return err;
    var count = service[0].commentCount - 1;
    Service.findByIdAndUpdate(serviceId, {commentCount: count}, function(err, data) {
      console.log(data);
    })
  })
  Comment.deleteOne({'_id': id}, function(err, data) {
    if (err) return (err);
    cb(data);   
  })
}

module.exports = {
  addService: addService,
  getServicesByZip: getServicesByZip,
  getServiceById: getServiceById,
  updateService: updateService,
  deleteService: deleteService,
  getServicesByUserId: getServicesByUserId,
  getServicesByFulfillerId: getServicesByFulfillerId,
  getServicesByStatus: getServicesByStatus,
  addComment: addComment,
  getCommentsByServiceId: getCommentsByServiceId,
  deleteComment: deleteComment
}