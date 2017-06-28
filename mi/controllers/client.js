var http = require("http");
var https = require("https");

var options = {
  host: 'localhost',
  port: 3000,
  path: '',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

var p = {
  getClient: (id) => {

    var queryString = "/clients/" + id
    var prot = http;

    options.path = queryString;
    return new Promise((resolve, reject) => {
      var req = prot.request(options, function(res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk) {
          output += chunk;
        });

        res.on('end', function() {
          var obj = JSON.parse(output);
          resolve({
            status: res.statusCode,
            data: obj
          });
        });
      });

      req.on('error', function(err) {
        reject(err);
      });

      req.end();
    });


  }
}

module.exports = p;
