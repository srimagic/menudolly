/*
provies config values
*/
module.exports = (function(){
    return {
        "search" : {
            "radius" : {
                "min" : "250ft",
                "max" : "20mi"
            },
            "defaults" : {
                "lat" : "34.0522",
                "lon" : "-118.2436"
            }
        },
        "caterer" : {
            "host"  : "localhost:9200",
            "index" : "catering",
            "mapping" : "caterer"
        },
        "menu" : {
            "host"  : "localhost:9200",
            "index" : "catering",
            "mapping" : "menu"
        },
        "items" : {
            "host"  : "localhost:9200",
            "index" : "food",
            "mapping" : "items"
        }
    };
})();
