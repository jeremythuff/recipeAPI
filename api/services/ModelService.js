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
        console.log('Done');
      }
    });
};