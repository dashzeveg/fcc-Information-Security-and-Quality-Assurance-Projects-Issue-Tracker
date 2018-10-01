/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const mongoose = require('mongoose');
mongoose.connect(CONNECTION_STRING);

var objectId = new ObjectId();

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  open: {type: Boolean, default: true}
});
/*
  _id: {
    'type': String,
    'default': objectId
  },
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
    */

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
    
      const Project = mongoose.model('issuetracker_'+project, projectSchema);
      
      let q = {};
      
      if(req.query._id)
        q._id = req.query._id;
    
      if(req.query.issue_title)
        q.issue_title = req.query.issue_title;
    
      if(req.query.issue_text)
        q.issue_text = req.query.issue_text;
    
      if(req.query.created_by)
        q.created_by = req.query.created_by;
    
      if(req.query.assigned_to)
        q.assigned_to = req.query.assigned_to;
    
      if(req.query.status_text)
        q.status_text = req.query.status_text;
    
      if(req.query.created_on)
        q.created_on = req.query.created_on;
    
      if(req.query.updated_on)
        q.updated_on = req.query.updated_on;
    
      if(req.query.open)
        q.open = req.query.open;
        
      //{_id: '5bb1ce4e64be765c4f982489'}
      let query=Project.find(q);
      query.exec(function (err1, doc1) {
        if (err1) 
          console.err( err1 );
        console.log(doc1);
        res.json(doc1);
      });
    })
    
    .post(function (req, res){
      var project = req.params.project;
      
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by)
        res.json({"error": "missing inputs"});
        //res.send('missing inputs');
      
      const Project = mongoose.model('issuetracker_'+project, projectSchema);
        
      let query = {
        issue_title: req.body.issue_title, 
        issue_text: req.body.issue_text, 
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to ? req.body.assigned_to : '',
        status_text: req.body.status_text ? req.body.status_text : ''
      };
    
      /*
      if(req.body.assigned_to)
        query.assigned_to = req.body.assigned_to;
      else
        query.assigned_to = '';
    
      if(req.body.status_text)
        query.status_text = req.body.status_text;
      else
        query.status_text = '';
      */
      Project.create(query, function (err, doc) {
        if (err) console.log(err);
        // saved!
        //console.log(doc);
        //res.json(doc);
        res.json({"_id": doc._id, "issue_title": doc.issue_title, "issue_text": doc.issue_text, "created_by": doc.created_by, "assigned_to": doc.assigned_to, "status_text": doc.status_text, "created_on": doc.created_on, "updated_on": doc.updated_on, "open": doc.open});
      });
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
    
      if (req.body._id === '')
        res.json({"error": "_id is empty!"});
    
      if(!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text){
        res.json({"error": "no updated field sent"});
      }else{
        //res.json({"error": "hihi"});
      }
    
      const Project = mongoose.model('issuetracker_'+project, projectSchema);
      
      let query = {
        updated_on: new Date()
      };
      
      if(req.body.issue_title)
        query.issue_title = req.body.issue_title;
    
      if(req.body.issue_text)
        query.issue_text = req.body.issue_text;
    
      if(req.body.created_by)
        query.created_by = req.body.created_by;
    
      if(req.body.assigned_to)
        query.assigned_to = req.body.assigned_to;
    
      if(req.body.status_text)
        query.status_text = req.body.status_text;
    
      if(req.body.open)
         query.open = false;
    
      Project.findOneAndUpdate({_id: req.body._id}, query, function (err, doc) {
        if (err)
          res.json({"message": "could not update", "_id": req.body._id});
        else{
          res.json({"message": "successfully updated"});
          console.log(doc);
        }
      });
      
      /*
      Project.findOne({_id: req.body._id}, function (err, doc) {
        
        if(req.body.issue_title)
          doc.issue_title = req.body.issue_title;
    
        if(req.body.issue_text)
          doc.issue_text = req.body.issue_text;

        if(req.body.created_by)
          doc.created_by = req.body.created_by;

        if(req.body.assigned_to)
          doc.assigned_to = req.body.assigned_to;

        if(req.body.status_text)
          doc.status_text = req.body.status_text;
        
        doc.updated_on = new Date();
        doc.open = req.body.open;

        doc.save(function (err1, doc1) {
          if (err1)
            res.json({"message": "could not update", "_id": doc1._id});
          else
            res.json({"message": "successfully updated", "_id": doc1._id});
        });
      });
      */
    })
    
    .delete(function (req, res){
      var project = req.params.project;
    
      if (!req.body._id)
        res.json({"error": '_id is empty!'});
    
      const Project = mongoose.model('issuetracker_'+project, projectSchema);
    
      Project.findByIdAndRemove(req.body._id, function (err, doc) {
        if (err) console.log(err);
        if(err){
          res.json({"error": err, "could not delete": req.body._id});
        }else{
          res.json({"deleted": req.body._id});
        }
        
      });
      
    });
    
};
