var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/ebms";

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ebms");

    dbo.createCollection("apiKeys")
    dbo.createCollection("devices")
    
    dbo.collection("apiKeys").insertOne({"token":"3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7"});

    db.close();
});

