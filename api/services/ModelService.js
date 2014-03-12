// ModelService.js - in api/services

var fs = require('fs'),
    xml2js = require('xml2js'),
    parseXML = new xml2js.Parser();


exports.clearAll = function(model) {

	model.find()
    .exec(function(err, result) {
      if(result.length == 0) {
        console.log("Query returned no results :(")
      }
      if(err){
        console.log(err)
      } else {
        for(i=0;i<result.length;i++) {
          var id = result[i]["id"];
          model.findOne(id).done(function(err, obj) {
            if(err) console.log("Unable to destroy record :(");
            // destroy the record
            obj.destroy(function(err) {
              console.log(obj.name + " has been destroyed!")
            });

          });
        }
        console.log('Done');
      }
    });
};

// ModelService.js - in api/services
exports.findByName = function(req, res, model) {
  model.find().where({name: req.param('name')}).exec(function(err, obj) {
    if (err) return res.send(err,500);
    return res.json(obj);
  });
};

// ModelService.js - in api/services
exports.searchByName = function(req, res, model) {
  var JSONorXML = req.params['JSONorXML'];
  var results = [];
  var searchTerms = Object.keys(req.query);
  for(i=0;i<searchTerms.length;i++) {
    model.find({
      nameForSearch: {
        contains: searchTerms[i]
      } 
    }, function(err, result) {
      results.push(result);
    });
  }
  
  if(JSONorXML === "xml") {
    var result = "Convert to "+req.params['JSONorXML'];
    console.log(result);
    return res.send(result); 
  }

  return results[0]; 

};