/*
elastic search module
1. getMenu - search all menus for all caterers active for any day of week or current day of week
2. getMenuCaterer - search all menus for given caterer active for any day of week or current day of week
*/
(function(){
	var elasticsearch = require('elasticsearch'),
		es = new elasticsearch.Client(),
		config = require('../config/main'),
		es_mapping = 'menu',
		getMenu = function(cb){
            es.search({
			  index: config[es_mapping].index,
			  type: config[es_mapping].mapping,
			  body: {
			    query: {
			      filtered: {
			        filter: {
			        	bool: {
			        		must: [
			        			{term: {active: true}},
			        			{bool: {
			        				should: [
			        					{term: {available_dow: 'any'}},
			        					{term: {available_dow: (new Date()).getDay()}}
			        				]
			        			}}
			        		]
			        		}
			        	}
			        }
			      }
			    }
			}).then(function (resp) {
			    var hits = resp.hits.hits;
			    for (var i=0, len=hits.length; i<len; i++){
			    	console.log({result: hits[i]['_source']})
			    }
			    cb();
			}, function (err) {
			    console.trace(err.message);
			});
		},
		getMenuCaterer = function(caterer_phone, cb){
			console.log({caterer_phone:caterer_phone});
			es.search({
			  index: config[es_mapping].index,
			  type: config[es_mapping].mapping,
			  body: {
			    query: {
			      filtered: {
			        filter: {
			        	bool: {
			        		must: [
			        			{term: {caterer_phone: caterer_phone}},
			        			{term: {active: true}},
			        			{bool: {
			        				should: [
			        					{term: {available_dow: 'any'}},
			        					{term: {available_dow: (new Date()).getDay()}}
			        				]
			        			}}
			        		]
			        		}
			        	}
			        }
			      }
			    }
			}).then(function (resp) {
				console.log({resp:resp});
			    var hits = resp.hits.hits;
			    for (var i=0, len=hits.length; i<len; i++){
			    	console.log({result: hits[i]['_source']})
			    }
			    cb();
			}, function (err) {
				console.log({err:err});
			    console.trace(err.message);
			});
		}
	;

	exports.getMenu = getMenu;
	exports.getMenuCaterer = getMenuCaterer;
})();