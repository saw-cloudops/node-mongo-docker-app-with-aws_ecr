let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient; // ၁။ mongodb လို့ ပြင်ထားတယ်
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, { 'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

// ၂။ mongodb:// လို့ ပြင်ထားတယ် 
// let mongoUrlLocal = "mongodb://admin:123456@localhost:27017";
// let mongoUrlLocal = "mongodb://admin:123456@mongodb:27017";
let mongoUrlLocal = process.env.MONGO_URL || "mongodb://admin:123456@mongodb:27017";
// "mongodb://admin:123456@mongodb:27017" <--mongodb is db service name, it can change.


let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// ၃။ Mongo Express ထဲမှာ မြင်နေရတဲ့ နာမည် 'user-account' ကို သုံးပါ
let databaseName = "user-account";

app.post('/update-profile', function (req, res) {
  let userObj = req.body;

  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) {
      console.error("Connection Error:", err);
      return res.status(500).send(err);
    }

    let db = client.db(databaseName);
    userObj['userid'] = 1;

    let myquery = { userid: 1 };
    let newvalues = { $set: userObj };

    // ဒီနေရာမှာ callback ထဲက res ကို mongodbRes လို့ နာမည်ပြောင်းထားတယ် (Conflict မဖြစ်အောင်)
    db.collection("users").updateOne(myquery, newvalues, { upsert: true }, function (err, mongodbRes) {
      if (err) throw err;
      client.close();
      console.log("Successfully updated!");
      res.send(userObj);
    });
  });
});

app.get('/get-profile', function (req, res) {
  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;
    let db = client.db(databaseName);
    let myquery = { userid: 1 };

    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      client.close();
      res.send(result ? result : {});
    });
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});