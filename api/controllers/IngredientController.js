/**
 * IngredientController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
    clearIngredients: function (req, res) {
	    Ingredient.find()
	    .exec(function(err, ingredient) {
	      if(ingredient.length == 0) {
	        console.log("Query returned no results :(")
	        return res.send("Failure!");
	      }
	      if(err){
	        console.log(err)
	        return res.send("Failure!");
	      }
	      else {
	        for(i=0;i<ingredient.length;i++) {
	          var id = ingredient[i]["id"];
	          Ingredient.findOne(id).done(function(err, ingredient) {
	            if(err) console.log("Unable to destroy record :(");
	            // destroy the record
	            ingredient.destroy(function(err) {
	              console.log(ingredient.name + " has been destroyed!")
	            });

	          });
	        }
	        console.log('Done');
	        return res.send("Success!");
	      }
	    });    
	},
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to IngredientController)
   */
  _config: {}

  
};
