/**
 * Ingredient
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	name: 'STRING',
  	uri: 'STRING',
  	usedIn: {
  		type: 'ARRAY',
		defaultsTo: []
  	}
  }

};
