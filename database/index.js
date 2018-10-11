const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoURI = process.env.DB_URI || 'mongodb://localhost/db';

mongoose.connect(mongoURI, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function() {
  console.log('mongo connected');
});

const ServiceSchema = new Schema({
  userId: {type: String, default: null},
  userName: {type: String, default: null},
  zip: {type: String, default: null},
  subject: {type: String, default: null},
  text: {type: String, default: null},
  status: {type: String, default: 'open'},
  fulfillerId: {type: String, default: null},
  fulfillerName: {type: String, default: null},
  commentCount: {type: Number, default: 0},
  time : { type : Date, default: Date.now }
});

const CommentSchema = new Schema({
  serviceId: {type: String},
  userName: {type: String},
  text: {type: String},
  userId: {type: String},
  time: {type: Date, default: Date.now}
})

const Service = mongoose.model('Service', ServiceSchema);
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
  Service: Service,
  Comment: Comment
}