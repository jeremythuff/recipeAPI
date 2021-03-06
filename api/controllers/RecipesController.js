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
    parseXML = new xml2js.Parser(),
    JSFtp = require('jsftp')

module.exports = {
    
  
  /**
   * Action blueprints:
   *    `/recipe/[name]`
   */
  getRecipeByName: function (req,res) {
    return ModelService.findByName(req,res,Recipes);
  },

  getRecipeByNameDATA: function (req,res) {
    return ModelService.findByNameDATA(req,res,Recipes);
  },

  search: function(req, res) {
    return ModelService.searchByName(req,res,Recipes);
  },

  searchDATA: function(req, res) {
    return ModelService.searchByNameDATA(req,res,Recipes);
  },

  index: function(req, res) {
    return ModelService.indexModel(req, res, Recipes);
  },

  indexDATA: function(req, res) {
    return ModelService.indexDATA(req, res, Recipes);
  },

  updateRecipes: function (req, res) {
    if((req.param("host")==="")||(req.param("port")==="")||(req.param("user")==="")||(req.param("pass")==="")) {
      console.log("blank fields");
      return res.json({"message": "error", "data": "Not all fields were completed!"});
    }

    ftp = new JSFtp({
      host: req.param("host"),
      port: req.param("port"), // defaults to 21
      user: req.param("user"), // defaults to "anonymous"
      pass: req.param("pass") // defaults to "@anonymous"
    });

    var timeOut = setInterval(function(){
      var err = "No response from FTP Server";
      console.log(err);
      clearTimeout(timeOut);
      return res.json({"message": "error", "data": err});
    },10000);

    ftp.get('/162.210.198.161_25440/7DaysToDie-Alpha/Data/Config/recipes.xml', 'assets/data/recipes.xml', function(hadErr) {
      clearTimeout(timeOut);
    
      if (hadErr) {
        console.log(err);
        return res.json({"message": "error", "data": err});
      } else {
        console.log('File copied successfully!');

        ModelService.clearAll(Recipes);
        ModelService.clearAll(Ingredients);
        
        fs.readFile("assets/data/recipes.xml", function(err, data) {
          if(err) {
            console.log(err);
            return res.json({"message": "error", "data": err});
          }

          parseXML.parseString(data, function (err, result) {
            var recipes = result.recipes.recipe;
            for(i=0;i<recipes.length;i++) {
              
              var recipe = recipes[i]['$'],
                  ingredientsOriginal = recipes[i]['ingredient'],
                  ingredients = [];
                  if(typeof(ingredientsOriginal)==='undefined')ingredientsOriginal={};
                  
              for(n=0;n<ingredientsOriginal.length;n++) {
                var ingredient = {};
                var ingredientForRecipe = {};
                ingredient['name'] = ingredientsOriginal[n]['$']['name'];
                ingredientForRecipe['name'] = ingredient['name'].replace(/([A-Z])/g, ' $1');
                ingredient['nameForSearch'] = ingredient['name'];//spilt on capitals 
                ingredientForRecipe['count'] = ingredientsOriginal[n]['$']['count'];
                ingredient['uri'] = "/ingredient/"+ingredient['name'];
                ingredientForRecipe['uri'] = ingredient['uri'];
                ingredient['usedIn'] = [];
                ingredient.usedIn.push(recipe.name);
                ingredientForRecipe['grid'] = {};

                var gridPos = ingredientsOriginal[n]['$']['grid'];
                if (typeof(gridPos)!='undefined') {
                  var gridPosArray = gridPos.split(",");
                  ingredientForRecipe['grid']['x'] = gridPosArray[0].replace(" ", "");
                  ingredientForRecipe['grid']['y'] = gridPosArray[1].replace(" ", "");
                }
                
                Ingredients.findOne({ name: ingredient.name }, function(err, result) {
                  if(typeof(result)==='undefined') {
                    Ingredients.create(ingredient)
                    .done(function(err, user) {
                      if (err) {
                        console.log(err);
                        return res.json({"message": "error", "data": err});
                      } else {
                        console.log(ingredient.name + " was added to the Ingredients");
                      }
                    });
                  } else {
                    Ingredients.findOne({name: ingredient.name}, function(err, results) {
                      if (err) {
                        console.log(err);
                        return res.json({"message": "error", "data": err});
                      } else {
                        if(results['usedIn'].indexOf(recipe.name)===-1) {
                          results['usedIn'].push(recipe.name);
                          results.save(function(err) {
                            if (err) {
                              console.log(err);
                              return res.json({"message": "error", "data": err});
                            } else {
                              console.log(ingredient.name + " was udated.");
                            }
                          });
                        }
                      }
                    });
                  }
                });

                ingredients.push(ingredientForRecipe);
              }
              
              Recipes.create({
                "name": recipe.name,
                "nameForSearch": recipe.name.replace(/([A-Z])/g, ' $1'),
                "count": recipe.count,
                "scrapable": recipe.scrapable === "True" ? true : false,
                "craft_area": recipe.craft_area,
                "craft_tool": recipe.craft_tool,
                "craft_time": recipe.craft_time,
                "ingredients": ingredients
              }).done(function(err, user) {
                if (err) {
                  console.log(err);
                  return res.json({"message": "error", "data": err});
                } else {
                   console.log("Just added the recipe for " + recipe.name);
                }
              });   
            } 
              
            console.log('Done');
            return res.json({"message": "Update Success!"});
          });
        });
      }
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
