/**
 * RecipeController
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
    
  
  /**
   * Action blueprints:
   *    `/recipe/getRecipeByName`
   */
   getRecipeByName: function (req,res) {
      if(req.param('name')=='create') return RecipeController.create;
      Recipe.findOne().where({name: req.param('name')}).exec(function(err, recipe) {
        if (err) return res.send(err,500);
        return res.json(recipe);
      });
  },

  updateRecipes: function (req, res) {
    var recipesXML = "";
    // Send a JSON response
    return res.send('/data/recipe.xml');

  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to RecipeController)
   */
  _config: {}

  
};
