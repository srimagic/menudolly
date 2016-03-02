/*
loads all food items data into elastic servers
depends on load.js
*/

var base = require('./bulk'),
    items = new base(),
    data_file = '../data/catering - items.tsv',
    es_mapping = 'items',
    data_fields = ["name", "about", "category", "cuisine", "img"]
;

items.start(data_file, data_fields, es_mapping);



