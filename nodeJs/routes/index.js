var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var objectId = require("mongodb").ObjectID;
var backup = require("mongodb-backup");
const fastcsv = require("fast-csv");
const fs = require("fs");
const exportFromJSON = require("export-from-json");
var str2json = require("string-to-json");
// mongoose.connect('mongodb://localhost:27017/test');
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/test";
const csvtojson=require("csvtojson");
var CSV = require('csv-string');

var dbUrl = "";
var collectionName = "";

router.get("/", function (req, res) {
  console.log("At list he came here");
  MongoClient.connect(url, function (err, db) {
    var adminDb = db.admin();
    adminDb.listDatabases(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        dbnames = result.databases;

        db.close();
        var arrOfNames = [];
        dbnames.forEach((element) => {
          arrOfNames.push(element.name);
        });
        console.log(arrOfNames);

        res.send(dbnames);
      }
    });
  });
});

router.post("/", (req, res) => {
  console.log("IN node ........");

  console.log("body here" + req.body.name);

  this.dbUrl = "mongodb://localhost:27017/" + req.body.name;
  console.log(" .............new url = " + this.dbUrl);
  MongoClient.connect(this.dbUrl, (err, db) => {
    if (err) throw err;
    db.listCollections().toArray(function (err, collections) {
      if (err) console.log(err);
      res.send(collections);
    });
  });
});

router.post("/BackupDatabase", (req, res) => {
  this.dbUrl = "mongodb://localhost:27017/" + req.body.name;
  MongoClient.connect(this.dbUrl, (err, db) => {
    if (err) throw err;
    var dir = req.body.name;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    db.listCollections().toArray(function (err, collections) {
      if (err) {
        console.log(err);
      } else {
        console.log(collections);

        var arrofcollection = [];
        collections.forEach((element) => {
          db.collection(element.name)
            .find({})
            .toArray((err, data) => {
              if (err) throw err;
              console.log(data);
              //  fs.writeFileSync(dir +"/"+element.name+".json", JSON.stringify(data));
              data.forEach((ele) => {
                fs.appendFileSync(
                  dir + "/" + element.name + ".json",
                  JSON.stringify(ele)
                );
              });
            });
          arrofcollection.push(element.name);
        });
        console.log(arrofcollection);
        res.send("ok");
      }
    });
  });
});

router.post("/deleteCollection", (req, res) => {
  MongoClient.connect(this.dbUrl, (err, db) => {
    if (err) {
      console.log(err);
    } else {
      db.collection(req.body.name).drop(function (err, delOK) {
        if (err) throw err;
        if (delOK) {
          console.log("Collection deleted");
          db.close();
          res.send("ok");
        }
      });
    }
  });
});

router.post("/ExportCollection", (req, res) => {
  MongoClient.connect(this.dbUrl, (err, db) => {
    if (err) {
      console.log(err);
    } else {
      var dir = "Exported/" + req.body.name;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      coll.find({}).toArray((err, data) => {
        if (err) throw err;
        const ws = fs.createWriteStream(dir + "/" + req.body.name + ".csv");
        console.log(data);
        fastcsv
          .write(data, { headers: true })
          .on("finish", function () {
            console.log("Write to " + req.body.name + " successfully!");
          })
          .pipe(ws);
      });

      res.send("ok");
    }
  });
});


router.post('/ImportFile', (req, res) => {
  fileName = req.body.fileName;
  console.log(fileName);

  csvtojson().fromFile("toImport/"+fileName).then(
    (data)=>{
      // console.log(data);
      MongoClient.connect(this.dbUrl , (err,db)=>{
        if(err){console.log(err)}
        else{
          coll.insertMany(data, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
            
          });
        }
      })
    }
  )
  res.send("ok");
});



// router.post("/ImportFile", (req, res) => {
// let rawdata = fs.readFileSync('company_datas.json');
// let student = JSON.parse(rawdata);

// student = (JSON.stringify(student));
// student.replace("'$oid'" ,"'oid'");




// student = JSON.parse(student);
// console.log(student);
//   // console.log("in node file");
//   // console.log(req.body.collectionName.name);
//   // // console.log(req.body.filedata);
//   // var data = req.body.filedata;
//   // console.log(typeof data);

//   // // data = "{"+data +"}";

//   // // var temp =JSON.stringify( data );
//   // // console.log(temp);

//   // var temp = JSON.stringify(data);

//   // console.log("------------reqpplaced ----------------");

//   // temp = temp
//   //   .replace(/\\n/g, "\\n")
//   //   .replace(/\\'/g, "\\'")
//   //   .replace(/\\"/g, '\\"')
//   //   .replace(/\\&/g, "\\&")
//   //   .replace(/\\r/g, "\\r")
//   //   .replace(/\\t/g, "\\t")
//   //   .replace(/\\b/g, "\\b")
//   //   .replace(/\\f/g, "\\f");

//   // console.log(temp);
//   // var uploaddata = JSON.parse(data);

//   // console.log("type of upload data :" + typeof uploaddata);

//   MongoClient.connect(this.dbUrl, (err, db) => {
//     if (err) {
//       console.log(err);
//     } else {
//       try {
//         coll.insertMany(student);
//       } catch (e) {
//         console.log(e);
//       }
//     }
//   });
//   res.send("ok");
// });

router.post("/ExportCollectionJson", (req, res) => {
  var temp = this.dbUrl;
  MongoClient.connect(this.dbUrl, (err, db) => {
    if (err) {
      console.log(err);
    } else {
      var dir = "Exported/" + req.body.name;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      coll.find({}).toArray((err, data) => {
        if (err) throw err;
        console.log(data);
        data.forEach((ele) => {
          fs.appendFileSync(
            dir + "/" + req.body.name + ".json",
            JSON.stringify(ele)
          );
        });
        this.dbUrl = temp;
        console.log(this.dbUrl);
        // fs.writeFileSync(req.body.name+".json", JSON.stringify(data));
      });
      res.send("ok");
    }
  });
});

router.post("/DeleteDb", (req, res) => {
  this.dbUrl = "mongodb://localhost:27017/" + req.body.name;
  MongoClient.connect(this.dbUrl, function (err, db) {
    if (err) throw err;
    else {
      console.log("else");
      db.dropDatabase(function (err, result) {
        console.log("Error : " + err);
        if (err) throw err;
        console.log("Operation Success ? " + result);
        db.close();
        res.send("ok");
      });
    }
  });
});

router.post("/getdata", (req, res) => {
  // MongoClient.connect(dbUrl)
  console.log(
    ".....................Collection name : " +
      req.body.name +
      "................."
  );

  this.collectionName = req.body.name;
  console.log(this.dbUrl);
  MongoClient.connect(this.dbUrl, (err, db) => {
    console.log("In Function");
    // console.log(this.dbUrl);
    if (err) {
      console.log(err);
    } else {
      coll = db.collection(req.body.name);
      coll.find({}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      });
    }
  });
});

router.post("/deletedata", (req, res) => {
  console.log("In delete method");
  // console.log(JSON.stringify(req));
  var id = req.body._id;
  console.log("id to delete : " + id);
  MongoClient.connect(this.dbUrl, (err, db) => {
    if (err) {
      console.log("Error in Delete Connection");
    } else {
      var coll = db.collection(this.collectionName);
      coll.deleteOne({ _id: objectId(id) }, function (err, result) {
        if (err) {
          console.log("error in deleteOne");
        } else {
          console.log("Item deleted");
          db.close();
          res.send(result);
        }
      });
    }
  });
});

router.put("/:id", (req, res) => {
  console.log("In update fun");
  var dataToUpdate = req.body;
  console.log(dataToUpdate);

  delete dataToUpdate._id;
  console.log(dataToUpdate);
  console.log(Object.keys(dataToUpdate));

  MongoClient.connect(this.dbUrl, (err, db) => {
    if (err) {
      console.log("Error in put fun connect");
    } else {
      var coll = db.collection(this.collectionName);
      coll.updateOne(
        { _id: objectId(req.params.id) },
        { $set: dataToUpdate },
        (err, response) => {
          if (err) {
            console.log("error in put fun update" + err);
          } else {
            console.log("data is updated");
            res.send();
          }
        }
      );
    }
  });
});

router.post("/searchString", (req, res) => {
  console.log("got in index search");
  console.log(req.body);

  MongoClient.connect(this.dbUrl, (err, db) => {
    if (err) {
      console.log("Error in put fun connect");
    } else {
      var fieldName = req.body.fieldName;
      var stringToSearch = req.body.stringToSearch;

      coll
        .find({ [fieldName]: stringToSearch })
        .toArray(function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            res.send(result);
          }
        });
    }
  });
});

router.post("/searchNumber", (req, res) => {
  console.log(req.body);
  MongoClient.connect(this.dbUrl, (err, db) => {
    console.log("Done!!!");
    if (err) {
      console.log("err" + err);
    } else {
      console.log("in else");
      var fieldName = req.body.fieldName;
      var number1 = req.body.number1;
      var number2 = req.body.number2;

      coll
        .find({ [fieldName]: { $gte: number1, $lte: number2 } })
        .toArray(function (err, result) {
          if (err) {
            console.log("err " + err);
          } else {
            console.log("result here " + result);
            res.send(result);
          }
        });
    }
  });
});

router.post("/searchDate", (req, res) => {
  console.log("IN SearchDate");
  console.log(req.body);

  MongoClient.connect(this.dbUrl, (err, db) => {
    if (err) {
      console.log(err);
    } else {
      var date1 = req.body.date1;
      var date2 = req.body.date2;
      var fieldName = req.body.fieldName;

      var date1iso = new Date(date1);
      var date2iso = new Date(date2);
      coll
        .find({ [fieldName]: { $gte: date1iso, $lte: date2iso } })
        .toArray(function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            res.send(result);
          }
        });
    }
  });
});

router.post("/searchObject", (req, res) => {
  console.log(req.body);

  MongoClient.connect(this.dbUrl, (err, db) => {
    if (err) {
      console.log(err);
    } else {
      var objecttosearch = req.body.objecttosearch;
      var fieldName = req.body.fieldName;

      var restosend = [];

      coll.find({}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // console.log(result);

          result.forEach((element) => {
            console.log(element[fieldName]);
            var keys = Object.values(element[fieldName]);
            // var keys = Object.keys(element[fieldName]);

            keys.forEach((ele) => {
              console.log(typeof element[fieldName][ele]);
              if (ele === objecttosearch) {
                restosend.push(element);
              }
            });
          });

          res.send(restosend);
        }
      });
    }
  });
});

module.exports = router;
