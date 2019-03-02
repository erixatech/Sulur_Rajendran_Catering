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
		  case "update":
			  var newvalues = { $set: dataJson };
			  dbo.collection(collectionName).updateOne(query, newvalues, function(err, res) {
				if (err) res.send("Error In Update"+err);
				db.close();
				res.send("Updated Successfully");
			  });
			  break;
		  case "delete":
			dbo.collection(collectionName).deleteOne(dataJson, function(err, obj) {
				if (err) res.send("Error In Delete"+err);
				db.close();
				res.send("Deleted Successfully");
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
