/*
loads all caterer menu data into elastic servers
depends on load.js
*/

var base = require('./load'),
    menu = new base(),
    data_file = '../data/catering - menu.tsv',
    es_mapping = 'menu',
    data_fields = ["caterer_phone", "caterer_fname", "caterer_lname", "item_name", "item_about", "item_category", "item_cuisine", "qty_type", "qty", "price", "available_dow"]
;

menu.start(data_file, data_fields, es_mapping);

