/**
 * Recipe
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

/*
<recipe name="porkGrilled" count="1" scrapable="False" craft_area="campfire" craft_tool="cookingGrill" craft_time="15" >
    <ingredient name="pork" count="1"/>
</recipe>
*/

var Recipe = {
	attributes: {
		name: {
			type: "STRING",
			defaultsTo: null
		},
		count: {
			type: "INTEGER",
			defaultsTo: null
		},
		scrapable: "BOOLEAN",
		craft_area: {
			type: "STRING",
			defaultsTo: null
		},
		craft_tool: {
			type: "STRING",
			defaultsTo: null
		},
		craft_time:  {
			type: "INTEGER",
			defaultsTo: null
		},
		ingredients:  {
			type: "ARRAY",
			defaultsTo: {}
		}
	}
}

module.exports = Recipe;
