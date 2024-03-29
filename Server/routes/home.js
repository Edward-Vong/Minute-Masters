const express = require("express");
//import { dirname } from "path";

//import { fileURLToPath } from "url";
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");
 

// recordRoutes.route("/home").get(function (req, res) {
//  let db_connect = dbo.getDb();
//  db_connect
//    .collection("users")
//    .find({})
//    .toArray(function (err, result) {
//      if (err) throw err;
//      res.json(result);
//    });
// });
 
// This section will help you get a single record by id
// recordRoutes.route("/record/:id").get(function (req, res) {
//  let db_connect = dbo.getDb();
//  let myquery = { _id: ObjectId(req.params.id) };
//  db_connect
//    .collection("records")
//    .findOne(myquery, function (err, result) {
//      if (err) throw err;
//      res.json(result);
//    });
// });
 
// This section will help you create a new record.
recordRoutes.route("/register").post(function (req, response) {
  console.log("hey");
 let db_connect = dbo.getDb();
 console.log(req.body.userName);
 let myobj = {
   userName: req.body.userName,
   email: req.body.email,
   password: req.body.password
 };
 if(db_connect.collection("users").find({email: req.body.email}))
 console.log(myobj);
 //console.log()
 db_connect.collection("users").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});

recordRoutes.route("/login").post(function (req, response) {
  let db_connect = dbo.getDb();
  if(db_connect.collection("users").find({email: req.body.email, password: req.body.password}))
  {
    console.log("IT WORKSSSS WOOOOOHHHHHH");
  }
})
 
// This section will help you update a record by id.
// recordRoutes.route("/update/:id").post(function (req, response) {
//  let db_connect = dbo.getDb();
//  let myquery = { _id: ObjectId(req.params.id) };
//  let newvalues = {
//    $set: {
//      name: req.body.name,
//      position: req.body.position,
//      level: req.body.level,
//    },
//  };
//  db_connect
//    .collection("records")
//    .updateOne(myquery, newvalues, function (err, res) {
//      if (err) throw err;
//      console.log("1 document updated");
//      response.json(res);
//    });
// });
 
// This section will help you delete a record
// recordRoutes.route("/:id").delete((req, response) => {
//  let db_connect = dbo.getDb();
//  let myquery = { _id: ObjectId(req.params.id) };
//  db_connect.collection("records").deleteOne(myquery, function (err, obj) {
//    if (err) throw err;
//    console.log("1 document deleted");
//    response.json(obj);
//  });
// });
 
recordRoutes.route("/").get(function (req, response){
  response.sendFile(__dirname + "/client/components/register");
});

module.exports = recordRoutes;