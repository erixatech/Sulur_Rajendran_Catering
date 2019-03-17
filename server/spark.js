var express = require("express");
var app = express();
var router = express.Router();

var path = require('path');
var bodyParser = require('body-parser');

var mongoOpn1 = require('./dbHandler');

app.use(express.static(path.join(__dirname, '../client')));

app.use(bodyParser.json()); // for parsing application/json

//Ingredient Queries

router.get("/getIngredients", function(req, res){
  mongoOpn1.mongoOpns(req, res, "Ingredients", "fetch", req.body);
});

router.post("/createIngredient", function(req, res){  
	mongoOpn1.mongoOpns(req, res, "Ingredients", "insertInArray", req.body);
});

router.post("/editIngredient", function(req, res){  
  mongoOpn1.mongoOpns(req, res, "Ingredients", "updateInArray", req.body);
});

router.post("/deleteIngredient", function(req, res){  
  mongoOpn1.mongoOpns(req, res, "Ingredients", "deleteIngredients", req.body);
});



//Recipe Queries
router.get("/getRecipe", function(req, res){
  mongoOpn1.mongoOpns(req, res, "Recipe", "fetch", req.body);
});

router.post("/createRecipe", function(req, res){  
	mongoOpn1.mongoOpns(req, res, "Recipe", "insertInArray", req.body);
});

router.post("/editRecipe", function(req, res){  
  mongoOpn1.mongoOpns(req, res, "Recipe", "updateInArray", req.body);
});

router.post("/deleteRecipe", function(req, res){  
  mongoOpn1.mongoOpns(req, res, "Recipe", "deleteRecipe", req.body);
});



//Order Queries

router.get("/getOrders", function(req, res){
  mongoOpn1.mongoOpns(req, res, "orders", "fetch", req.body);
});

router.get("/getOrderById", function(req, res){
  mongoOpn1.mongoOpns(req, res, "orders", "getOrderById", req.body);
});

router.post("/createOrder", function(req, res){  
	mongoOpn1.mongoOpns(req, res, "orders", "insertOrder", req.body);
});

router.post("/updateOrder", function(req, res){  
	mongoOpn1.mongoOpns(req, res, "orders", "updateOrder", req.body);
});

router.delete("/deleteOrder", function(req, res){  
  mongoOpn1.mongoOpns(req, res, "orders", "delete", req.body);
});

app.use("/",router);

app.listen(80,function(){
  console.log("Live at Port 80");
});