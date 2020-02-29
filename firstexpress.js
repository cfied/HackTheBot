var express = require('express');
var fs = require('fs');
var app = express();

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   fs.readFile('testAngularJS.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
})

app.get('/welcome', function (req, res){
  console.log("Yay, send myself a request");
  res.send("Lovely to see you");
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})