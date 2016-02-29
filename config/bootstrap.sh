
#elastic index mapping file

curl -XDELETE 'http://localhost:9200/catering'

#caterer
curl -XPOST 'http://localhost:9200/catering' -d '
{
  "settings":{
      "number_of_shards": 1,
      "number_of_replicas": 0
  },
  "mappings": {
    "caterer" : {
      "_all" : {
        "enabled":false
      },
      "_timestamp" : {
        "enabled" : true
      },
      "properties" : {
        "buss_name": {"type":"string"},
        "first_name": {"type":"string"},
        "last_name": {"type":"string"},
        "category": {"type":"string"},
        "gender": {"type":"string"},
        "phone": {"type":"string"},
        "img": {"type":"string", "index":"not_analyzed"},
        "about": {"type":"string", "index":"not_analyzed"},
        "likes": {"type":"integer", "index":"not_analyzed"},
        "active": {"type":"boolean", "index":"not_analyzed"},
        "pin" : {
          "type" : "object",
          "properties" : {
            "location" : {
              "type" : "geo_point"
            }
          } 
        }
      }
    },
    "menu" : {
      "_all" : {
        "enabled":false
      },
      "_timestamp" : {
        "enabled" : true
      },
      "_parent": {
        "type": "caterer"
      },
      "properties" : {
        "caterer_phone": {"type":"string"},
        "caterer_fname": {"type":"string"},
        "caterer_lname": {"type":"string"},
        "item_name": {"type":"string"},
        "item_about": {"type":"string"},
        "item_category": {"type":"string"},
        "item_cuisine": {"type":"string"},
        "qty_type": {"type":"string", "index":"not_analyzed"},
        "qty": {"type":"string", "index":"not_analyzed"},
        "price": {"type":"string", "index":"not_analyzed"},
        "pin" : {
          "type" : "object",
          "properties" : {
            "location" : {
              "type" : "geo_point"
            }
          } 
        },
        "available_dow": {"type":"string"},
        "available_date": {"type":"date"},
        "active": {"type":"boolean", "index":"not_analyzed"}
      }
    }
  }
}
'

# food items
curl -XDELETE 'http://localhost:9200/food'

curl -XPOST 'http://localhost:9200/food' -d '
{
  "settings":{
      "number_of_shards": 1,
      "number_of_replicas": 0
  },
  "mappings": {
    "items" : {
      "_all" : {
        "enabled":false
      },
      "_timestamp" : {
        "enabled" : true
      },
      "properties" : {
        "name": {"type":"string"},
        "about": {"type":"string", "index":"not_analyzed"},
        "category": {"type":"string"},
        "cuisine": {"type":"string"},
        "img": {"type":"string", "index":"not_analyzed"},
        "active": {"type":"boolean", "index":"not_analyzed"}
      }
    }
  }
}
'