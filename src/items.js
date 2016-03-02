/*
elastic search module
1. getMenu - search all menus for all caterers active for any day of week or current day of week
2. getMenuCaterer - search all menus for given caterer active for any day of week or current day of week
*/
(function(){
	var elasticsearch = require('elasticsearch'),
		es = new elasticsearch.Client(),
		config = require('../config/main'),
		es_mapping = 'items',
		getItem = function(itemName, cb){
            es.search({
			  index: config[es_mapping].index,
			  type: config[es_mapping].mapping,
			  body: {
			    query: {
			      match: {
			      	name: {
			      		"query": itemName,
			      		"minimum_should_match": "75%"
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
		}
	;

	getItem('aloo', function(){

	});

	exports.getItem = getItem;
})();