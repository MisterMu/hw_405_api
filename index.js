var MongoClient = require('mongodb').MongoClient;
var URL = 'mongodb://MisterMu:mumumu@ds259855.mlab.com:59855/hw_405';

MongoClient.connect(URL, function(err, db) {
  if (err)  throw err;
  var express = require('express');
  var bodyParser = require('body-parser');
  var path = require('path');
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded( {extended: false} ));
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.listen((process.env.PORT || 8080), function() {

    app.get('/', function(req, res) {
      db.collection('users').find({}, {_id: false}).toArray(function(err, result) {
        if (err) throw err;
        res.render('index', {
          title: 'customer list',
          users: result
        })
      });
    });

    app.get('/user', function(req, res){
      db.collection('users').find({}, {_id: false}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
      });
    });

    app.post('/user', function(req, res) {
      db.collection('users').find({}).sort({id:-1}).limit(1).toArray(function(err, result) {
        if (err) throw err;
        var uid = result[0]['id'];
        var newUser = {
          id: parseInt(uid) + 1 ,
          name: req.body.name,
          age: parseInt(req.body.age),
          email: req.body.email
        }
        db.collection('users').insertOne(newUser, function(err, res) {
          if (err) throw err;
        });
        res.send('insert user ' + (uid + 1) + ' success!!');
      });
    });

    app.get('/user/:id', function(req, res) {
      db.collection('users').find({id: parseInt(req.params.id)}, {_id: false}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result)
      })
    });

    app.put('/user/:id', function(req, res) {
      var id = parseInt(req.params.id);
      var newValue = {
        id: id,
        name: req.body.name,
        age: parseInt(req.body.age),
        email: req.body.email
      }
      db.collection('users').updateOne({id: id}, newValue, function(err, result) {
        if (err) throw err;
        res.send('update user ' + id + ' success!!');
      });
    });

    app.delete('/user/:id', function(req,res) {
      var id = parseInt(req.params.id);
      db.collection('users').deleteOne({id: id}, function(err, result) {
        if (err) throw err;
        res.send('delete user ' + id + ' success!!');
      });
    });
  });
});