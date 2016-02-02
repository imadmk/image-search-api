var https = require('https');
var querystring = require('querystring');

var googlesearchService = function () {
    
    var search = function (query, offset, cb) {
        
        var squery = querystring.stringify({q: query});
        var page = '';
            if (offset !== {}) {
                page = '&start=' + ((parseInt(offset)*10)-9);
            }

        var options = {
            hostname: 'www.googleapis.com',
            port: 443,
            path: '/customsearch/v1?' + squery + '&cx=008032595621022512502%3A3or-tfeoe68&searchType=image' +
                            page + '&key=AIzaSyCVZ85KAcoIBlGw93qo67Fh0SS09sKJOMs',
            method: 'GET'
        };
        
        var callback = function(response) {
            var data = '';
            
            response.setEncoding('utf8');
            response.on('data', function (result) {
               data += result;
            });
            
            response.on('end', function () {
                var datajson = JSON.parse(data);
                var sentjson = [];
                
                var items = datajson.items;
                
                for (var index in items) {
                    sentjson[index] = {
                        "imageURL": items[index].link, 
                        "alt-text": items[index].snippet, 
                        "pageURL": items[index].image.contextLink
                    }
                }
                
                cb(null, sentjson);
            });
        };
        
        https.request(options, callback).end();
    };
    
    return {
        search: search
    };
    
};

module.exports = googlesearchService;