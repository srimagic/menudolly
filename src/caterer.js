/*
loads all caterer data into elastic servers
depends on load.js
*/

var base = require('./load'),
	caterer = new base(),
	data_file = '../data/catering - caterer.tsv',
	es_mapping = 'caterer',
	data_fields = ["phone", "buss_name", "first_name", "last_name", "gender", "about", "category", "cuisine", "address_line", "city", "state", "zip"]
;

caterer.start(data_file, data_fields, es_mapping);
