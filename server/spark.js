var express = require("express");
var app = express();
var router = express.Router();

var path = require('path');
var bodyParser = require('body-parser');

var mongoOpn1 = require('./dbHandler');

app.use(express.static(path.join(__dirname, '../client')));

app.use(bodyParser.json()); // for parsing application/json

router.post("/createIngredient", function(req, res){  
	mongoOpn1.mongoOpns(req, res, "Ingredients", "insert", req.body);
});

app.use("/",router);

app.listen(3000,function(){
  console.log("Live at Port 3000");
});