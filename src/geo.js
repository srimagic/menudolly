
/*
module that finds lat/lon and formatted address for an input address
depends on google geo api
*/
module.exports = function(address, cb){
	var url = "",
        GEOURL = "https://maps.googleapis.com/maps/api/geocode/json?address=<<address>>&key=AIzaSyDbKJDG3rQsxLVL9gbhHtP3RcjuRmWx3ug"
        ;
        
        address.address_line = address.address_line || '';
        address.city = address.city || '';
        address.state = address.state || '';
        address.zip = address.zip || '';

        url = GEOURL.replace("<<address>>", address.address_line + ', ' + address.city + ', ' + address.state + ' ' + address.zip);
        
        require('request')(url, function(err, res){

            if (err) {
                return cb(err);
            }

            var body = JSON.parse(res.body),
                rows = undefined,
                isGeoFound = false;

            if (body.results.length < 1) {
            	console.log({address:address, err:'no results'});
                return cb({err:'no results'});
            }

            body.results.map(function(res){
                if (res.geometry) {
                    isGeoFound = true;  
                    return cb(null, {lat:res.geometry.location.lat, lng:res.geometry.location.lng, formatted_address:res.formatted_address});
                }
            });

            if (!isGeoFound) {
                console.log({address:address, err:'no results'});
                return cb({err:'no results'});
            }
        });
};