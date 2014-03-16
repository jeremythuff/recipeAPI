// ModelService.js - in api/services

var fs = require('fs'),
    xml2js = require('xml2js'),
    parseXML = new xml2js.Parser();

// ModelService.js - in api/services
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
        console.log('Done!');
      }
    });
};

// ModelService.js - in api/services
exports.findByName = function(req, res, model) {
  model.find().where({name: req.param('name')}).exec(function(err, obj) {
    if (err) return res.send(err,500);
    return res.view();
  });
};

// ModelService.js - in api/services
exports.findByNameDATA = function(req, res, model) {
  model.find().where({name: req.param('name')}).exec(function(err, obj) {
    if (err) return res.send(err,500);

    if(req.param("JSONorXML") == "xml") {
      var toConvert = {};
      toConvert["results"] = {};
      toConvert["results"]['result'] = [];
      for(i=0;i<obj.length;i++) {
        toConvert["results"]["result"].push(obj[i]);
      }
      var builder = new xml2js.Builder();
      var xml = builder.buildObject(toConvert);

      return res.header('Content-Type', 'text/xml').send(xml); 
    }

    return res.json(obj);
  });
};

// ModelService.js - in api/services
exports.searchByName = function(req, res, model) {
  var JSONorXML = req.param('JSONorXML');
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
  
  return res.view(); 

};

// ModelService.js - in api/services
exports.searchByNameDATA = function(req, res, model) {
  var JSONorXML = req.param('JSONorXML');
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
    var toConvert = {};
    toConvert["results"] = {};
    toConvert["results"]['result'] = [];
    for(i=0;i<results[0].length;i++) {
      toConvert["results"]["result"].push(results[0][i]);
    }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(toConvert);
    console.log("found it!");
    return res.header('Content-Type', 'text/xml').send(xml); 
  }
  console.log("found it!");
  return res.json(results[0]); 

};

// ModelService.js - in api/services
exports.indexModel = function(req, res, model) {
  return res.view();
};

// ModelService.js - in api/services
exports.indexDATA = function(req, res, model) {
  var JSONorXML = req.param('JSONorXML');
  model.find().done(function(err, response) {
    if (err) return res.send(err,500);

    if(JSONorXML === "xml") {
      var toConvert = {};
      toConvert["results"] = {};
      toConvert["results"]['result'] = [];
      for(i=0;i<response.length;i++) {
        toConvert["results"]["result"].push(response[i]);
      }
      var builder = new xml2js.Builder();
      var xml = builder.buildObject(toConvert);
      return res.header('Content-Type', 'text/xml').send(xml); 
    }

    return res.json(response);
  });
};


