
const fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      env          = process.env,
	  express = require('express'),
	  
	  html = require('html'),
		MongoClient = require('mongodb').MongoClient,
		assert = require('assert'),
		mongoose = require('mongoose')
		
let app = express();

//----------------dbconfig---------------------------------------------------------------------------------------------------

let mongoUrl = 'mongodb://localhost:27017/test';
//let mongoUrl = 'mongodb://admin:VTrLiJlV8RbY@127.5.99.130:27017/infoplanetservisapp';

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connection opened!');
  
});

mongoose.connect(mongoUrl);

var nalogSchema = mongoose.Schema({
    ime: String,
	prezime:String,
	vrsta:String,
	marka:String,
	opiskvara:String,
	pretpkvara:String,
	pretpcijena:String,
	serviser:String,
	dodatno:Object
});

var nalog = mongoose.model('nalog', nalogSchema);
//---------------------------------------------------------------------------------------------------------------------------




/*
var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('meow');
  }
});
*/



//setTimeout(console.log(rez),3000);

//console.log(result);

//-----------------------------------------




//insertiraj(url,marke,{});



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

// view engine setup
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use('/static', express.static('static'));

/// catch 404 and forwarding to error handler


/// error handlers

// development error handler
// will print stacktrace



app.get('/', function(req,res){
	console.log('get /');
	res.render('index.html');
});

app.get('/nalognovi', function(req,res){
	console.log(req.query);
	var noviNalog = new nalog(req.query);
	noviNalog.save(function(err,nalog){
		if(err) return console.log(err);
		console.log(nalog);
		res.send({status : 200});
	});
	
});

app.get('/selection', function(req,res){
	
	console.log(req.query.selection);
	dohvati(req.query.selection,{},function(result){  //selection(id iz klijenta)  /callback result
		console.log(result);
		if(result.length != 0){
			res.send(result);
			console.log('poslalo: ' + result);
		}
		else{
			res.send({message : '404'});
		}
	});
},function(){
	res.send()
});

app.get('/dohvatinaloge', function(req,res){
	console.log('get /dohvatinaloge');
	nalog.find(function(err,nalozi){
		if(err) return console.log(err);
		console.log(nalozi);
		res.send(nalozi);
	});
});
 
 // IMPORTANT: Your application HAS to respond to GET /health with status 200
  //            for OpenShift health monitoring

  app.get('/health',function(req,res) {
    res.writeHead(200);
	res.send();
  });

  
 /* 
  if (url == '/health') {
    res.writeHead(200);
    res.end();
  } else if (url.indexOf('/info/') == 0) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
  } else {
    fs.readFile('./static' + url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        let ext = path.extname(url).slice(1);
        res.setHeader('Content-Type', contentTypes[ext]);
        if (ext === 'html') {
          res.setHeader('Cache-Control', 'no-cache, no-store');
        }
        res.end(data);
      }
    });
  }
});

server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});

*/


app.listen(env.NODE_PORT || 8080, env.NODE_IP || 'localhost',function(){
	console.log('listen 8080');
});

module.exports = app;
