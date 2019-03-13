var express = require("express");
var app = express();
var router = express.Router();

var path = require('path');
var bodyParser = require('body-parser');

var mongoOpn1 = require('./dbHandler');

app.use(express.static(path.join(__dirname, '../client')));

app.use(bodyParser.json()); // for parsing application/json

router.post("/createIngredient", function(req, res){  
	mongoOpn1.mongoOpns(req, res, "Ingredients", "insertIngredients", req.body);
});

router.post("/editIngredient", function(req, res){  
  mongoOpn1.mongoOpns(req, res, "Ingredients", "updateIngredients", req.body);
});

router.post("/deleteIngredient", function(req, res){  
  mongoOpn1.mongoOpns(req, res, "Ingredients", "deleteIngredients", req.body);
});

router.delete("/deleteOrder", function(req, res){  
  mongoOpn1.mongoOpns(req, res, "orders", "delete", req.body);
});

router.get("/getIngredients", function(req, res){
  mongoOpn1.mongoOpns(req, res, "Ingredients", "fetch", req.body);
});

router.get("/getOrders", function(req, res){
  mongoOpn1.mongoOpns(req, res, "orders", "fetch", req.body);
});

router.post("/createOrder", function(req, res){  
	mongoOpn1.mongoOpns(req, res, "orders", "insertOrder", req.body);
});

app.use("/",router);

app.listen(80,function(){
  console.log("Live at Port 80");
});