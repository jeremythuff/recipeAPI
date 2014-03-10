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

//requires
var fs = require('fs'),
    xml2js = require('xml2js'),
    parseXML = new xml2js.Parser();

module.exports = {
    
  
  /**
   * Action blueprints:
   *    `/recipe/[name]`
   */
  getRecipeByName: function (req,res) {
    if(req.param('name')=='create') return RecipeController.create;
    Recipes.find().where({name: req.param('name')}).exec(function(err, recipe) {
      if (err) return res.send(err,500);
      return res.json(recipe);
    });
  },

  updateRecipes: function (req, res) {
    ModelService.clearAll(Recipes);
    fs.readFile("assets/data/recipes.xml", function(err, data) {
        console.log(err, data);
        
        parseXML.parseString(data, function (err, result) {
            var recipes = result.recipes.recipe;
            for(i=0;i<recipes.length;i++) {
              
              var recipe = recipes[i]['$'],
                  ingredientsOriginal = recipes[i]['ingredient'],
                  ingredients = [];
                  if(typeof(ingredientsOriginal)==='undefined')ingredientsOriginal={};
                  
              for(n=0;n<ingredientsOriginal.length;n++) {
                var ingredient = {};
                ingredient['name'] = ingredientsOriginal[n]['$']['name'];
                ingredient['count'] = ingredientsOriginal[n]['$']['count'];
                ingredient['usedIn'] = [];

                var gridPos = ingredientsOriginal[n]['$']['grid'];
                if (typeof(gridPos)!='undefined') {
                  var usedIn = {};
                  var gridPosArray = gridPos.split(",");
                  usedIn['grid'] = {};
                  usedIn['grid']['name'] = recipe.name; 
                  usedIn['grid']['x'] = gridPosArray[0].replace(" ", "");
                  usedIn['grid']['y'] = gridPosArray[1].replace(" ", "");
                  ingredient['usedIn'].push(usedIn);
                }
                
                Ingredients.findOne({ name: ingredient.name }, function(err, result) {
                  if(typeof(result)==='undefined') {
                    Ingredients.create(ingredient)
                    .done(function(err, user) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log(ingredient.name + " was added to the Ingredients");
                      }
                    });
                  } else {
                    console.log(ingredient.name + " already exists");
                  }
                });

                Ingredients.findOne({ name: ingredient.name }, function(err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    ingredients.push(result);  
                  }
                });
                
              }
              
              Recipes.create({
                "name": recipe.name,
                "count": recipe.count,
                "scrapable": recipe.scrapable === "True" ? true : false,
                "craft_area": recipe.craft_area,
                "craft_tool": recipe.craft_tool,
                "craft_time": recipe.craft_time,
                "ingredients": ingredients
              }).done(function(err, user) {
                if (err) {
                  return console.log(err);
                } else {
                   console.log("Just added the recipe for " + recipe.name);
                }
              });

             
            } 
              
            console.log('Done');
            return res.send("Success!");
        });
    });
  },

  clearRecipes: function (req, res) {
    ModelService.clearAll(Recipes);
  },
  
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to RecipeController)
   */
  _config: {}

  
};
