var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbName = "src";

function mongoOpns(req, res, collectionName, operation, dataJson, query)
{
	var toRet = "Error in DB Operation:" + operation;
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(dbName);

	  switch(operation)
	  {
		  case "insert":
		  	    dbo.collection(collectionName).insertOne(dataJson, function(err, resp) {
					if (err) res.send("Error In Insert"+err);
					db.close();
					res.send("Inserted Successfully");
				});
			  break;
		  case "insertOrder":
	  	    dbo.collection(collectionName).insertOne(dataJson, function(err, resp) {
				if (err) res.send("Error In Insert"+err);
				db.close();
				res.send(resp);
			});
		 	 break;
		  case "insertIngredients":
		  	    dbo.collection(collectionName).update({"name": "Ingredients"},{ "$push" : dataJson}, function(err, resp) {
					if (err) res.send("Error In Insert"+err);
					db.close();
					res.send(resp);
				});
			  break;
		  case "update":
			  var newvalues = { $set: dataJson };
			  dbo.collection(collectionName).updateOne(query, newvalues, function(err, resp) {
					if (err) res.send("Error In Update"+err);
					db.close();
					res.send("Updated Successfully");
			  });
			  break;
		  case "updateIngredients":
	  		var newvalues = { $set: dataJson };
		  	dbo.collection(collectionName).update({"name": "Ingredients"},newvalues, function(err, resp) {
					if (err) res.send("Error In Update"+err);
					db.close();
					res.send(resp);
			  });
			  break;
		  case "delete":
			dbo.collection(collectionName).deleteOne(dataJson, function(err, obj) {
					if (err) res.send("Error In Delete"+err);
					db.close();
					res.send("Deleted Successfully");
			  });
			  break;
		  case "deleteIngredients":
			dbo.collection(collectionName).update({"name": "Ingredients"},{ "$pull" : dataJson}, function(err, resp) {
					if (err) res.send("Error In Insert"+err);
					db.close();
					res.send(resp);
				});
			  break;
		  default:
			dbo.collection(collectionName).find(dataJson).toArray(function(err, result) {
					if (err) res.send("Error In Fetch"+err);
					db.close();
					res.send(result);
			  });
			  break;
	    }
	});
}

module.exports.mongoOpns = mongoOpns;
