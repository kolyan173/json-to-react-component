var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var bodyParser = require("body-parser");
var multer = require('multer');
var configFile = require('./config-file.json');
var app = express();
app.use(bodyParser.json());
var compiler = webpack(config);

var storage = multer.memoryStorage();
var upload = multer({ storage : storage}).single('config-file');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/config-file', upload, function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(configFile));
});

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
// require('./file-uploader')(app);

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
})
