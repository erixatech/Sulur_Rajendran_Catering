var fs = require('fs');
var express = require("express");
var app = express();
var router = express.Router();
//var path = __dirname + '/views/'; // this folder should contain your html files.
var mongoOpn1 = require('./dbHandler');
var path = require('path');
var bodyParser = require('body-parser');

var http = require('http');
var fs = require('fs');
var jsdom = require("jsdom");
const {JSDOM} = jsdom;
global.$;
global.a = 'a';

app.use(express.static(path.join(__dirname, '../client')));

app.use(bodyParser.json()); // for parsing application/json

router.post("/createIngredient", function(req, res){  
	/*var testJsonOld = {"name" : "Guru"};
	var testJson = {"name" : "Arun"};
  console.log(req.body);*/
	mongoOpn1.mongoOpns(req, res, "receipeTest", "insert", req.body);
});

app.use("/",router);

app.listen(3000,function(){
  console.log("Live at Port 3000");
});