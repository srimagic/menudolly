/*
elastic search module
1. getCaterers - get all caterers
2. getCaterer - get caterer info
*/
(function(){
	var elasticsearch = require('elasticsearch'),
		es = new elasticsearch.Client(),
		config = require('../config/main'),
		es_mapping = 'caterer',
		getCatererByPhone = function(caterer_phone, cb){
			es.search({
			  index: config[es_mapping].index,
			  type: config[es_mapping].mapping,
			  body: {
			    query: {
			      filtered: {
			        filter: {
			        	bool: {
			        		must: [
			        			{term: {fphone: caterer_phone}},
			        			{term: {active: true}}
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
		},
		getCaterers = function(cb){
			es.search({
			  index: config[es_mapping].index,
			  type: config[es_mapping].mapping,
			  body: {
			    query: {
			      filtered: {
			        filter: {
			        	bool: {
			        		must: [
			        			{term: {active: true}}
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
	
	exports.getCatererByPhone = getCatererByPhone;
	exports.getCaterers = getCaterers;
})();