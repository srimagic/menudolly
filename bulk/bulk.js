/*
this is base class for loading data into elastic index/types
arguments:
data_file - input file to load
data_fields - all fields to parse in input data file
es_mapping - elastic mapping from config
*/

var load = function(){};

load.prototype.start = function(data_file, data_fields, es_mapping, es_mapping_id){
    var fs = require('fs'),
        line_by_line = require('line-by-line'),
        elasticsearch = require('elasticsearch'),
        request     = require('request'),
        phoneFormatter = require('phone-formatter'),
        phonenumber    = require('node-phonenumber'),
        phoneUtil = phonenumber.PhoneNumberUtil.getInstance(),
        config = require('../config/main'),
        GEOURL = "https://maps.googleapis.com/maps/api/geocode/json?address=<<address>>&key=AIzaSyDbKJDG3rQsxLVL9gbhHtP3RcjuRmWx3ug",
        es = new elasticsearch.Client(),
        data = {},
        DELIMITER = "\t",
        field_value = "",
        field_index = 0,
        extract = function() {
            var lr = new line_by_line(data_file),
                line_num = 1;
            ;

            lr.on('error', function (err) {
                // 'err' contains error object
                console.log("err reading file = ", JSON.stringify(err));
            });

            lr.on('line', function (line) {
                if (line_num == 1) {
                    line_num = line_num + 1;
                    return;
                }

                lr.pause();

                setTimeout(function() {
                    //console.log("\n ***line = ", line);
                    field_index = 0;
                    field_value = "";

                    for (var i=0, len = line.length; i< len; i++) {
                          if (line[i] === DELIMITER) {
                            //console.log("field_data = ", field_value);
                            data[data_fields[field_index]] = field_value;
                            field_index = field_index + 1;
                            field_value = "";
                          } else {
                            field_value = field_value + line[i];
                          }
                    }

                    data[data_fields[field_index]] = field_value;
                    field_data = "";

                    console.log({line_num:line_num, data:data});
                    
                    transform(data, function(err){

                        if (err) {
                            console.error({err:err});
                            process.exit(1);
                        }

                        console.log({line_num:line_num, data_after_transform:data});

                        load(line_num, data, function(err, res){
                            if (err) {
                                process.exit(1);
                            }
                            line_num = line_num + 1;
                            data = {};
                            lr.resume();
                        });
                    });
                }, 100);
            });
            
            lr.on('end', function () {
                // All lines are read, file is closed now.
                console.log("***** number of lines read = ", line_num);
                process.exit(0);
            });
        },
        transform = function(data, cb) {

            data["likes"] = 0;
            data["active"] = true;

            if (data["phone"]){
                data["fphone"] = formatPhone(data["phone"]);
            }

            if (data["caterer_phone"]){
                data["caterer_phone"] = formatPhone(data["caterer_phone"]);
            }

            if (!data["address_line"]) {
                return cb(null);
            }
            
            require('../common/geo')(data, function(err, location){
                if (err) {
                    console.log({err:err, data:data});
                    return cb(null);
                } 
                data["pin"] = {};
                data["pin"]["location"] = {};
                data["pin"]["location"]["lat"] = location.lat;
                data["pin"]["location"]["lon"] = location.lng;
                data["faddress"] = location.formatted_address;
                return cb(null);
            });
            
        },
        load = function(line_num, data, cb) {

            var es_input = {
                index : config[es_mapping].index,
                type : config[es_mapping].mapping,
                body : data
            };

            switch (es_mapping){
                case 'caterer':
                    es_input['id'] = data['fphone'];
                    break;

                case 'menu':
                    es_input['parent'] = data['caterer_phone'];
                    break;

                case 'items':
                    es_input['id'] = data['name'].toString().replace(' ','');
                    break;
            }

            es.index(es_input, function(err, res){
                
                if (err) {
                  console.log("Err creating index data = ", JSON.stringify(data), " err = ", JSON.stringify(err));
                  return cb(err);
                }
                console.log("index num ", line_num, " success = ", JSON.stringify(res));
                return cb(null);
            });
        },
        formatPhone = function(phone) {
            try {
                return phoneUtil.format(phoneUtil.parse(phone, 'US'), phonenumber.PhoneNumberFormat.INTERNATIONAL);
            } catch (e) {
                console.log("\n *** exception formatting phone = ", phone);
                return phone;
            }
        }
    ;
    extract();
};

module.exports = load;


