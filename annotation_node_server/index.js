var express = require('express');
var fs = require('fs');
var cors = require('cors');
var app = express();
//app.use(cors());
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE");
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    next();
};
app.use(allowCrossDomain);
var bodyParser = require('body-parser');

var numImages = 25;

var urlIndices = [];

for(var i = 0; i < numImages; i++)
{
  urlIndices[i] = 0;
}

app.use(bodyParser.urlencoded({extended:false, limit:'50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.set('port', (process.env.PORT || 42069));

function send_message(req, res)
{
	console.log('received message\n');
    var indexIndices = req.body.urlIndex;
    var thisIndex = urlIndices[indexIndices];
    urlIndices[indexIndices] += 1;
    var fileBody = "";
    fileBody += req.body.width + " ";
    fileBody += req.body.height + " ";
    fileBody += req.body.enc;
    fs.writeFile("output_image_" + indexIndices + "_" + thisIndex + ".santorum",
                 fileBody, 
                 (err) => {if(err) throw err;}
                );
    console.log('saved file');
    response = {body:"ok dude"};
    res.end(JSON.stringify(response));
}



app.post('/send_message', send_message);
//app.options('/send_message', send_message);
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
