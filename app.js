const fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      env          = process.env,
	  express = require('express'),
	  
	  html = require('html')
		MongoClient = require('mongodb').MongoClient,
		assert = require('assert')

let app = express();

//----------------dbconfig------------------
var marke = 'marke';
var nalog = 'nalog';
let var mongoUrl = 'mongodb://localhost:27017/infoplanetservisapp';
//---------------------------------------------------


var insertDocument = function(db,collection,data, callback) {
   db.collection(collection).insert(
			data,
			function(err, result) {
				if(err)
					console.log('failed to insert')
				
				assert.equal(err, null);
				console.log("insertiarno u kolekciju naloga");
				callback();
		  }
  );
};


var insertiraj = function(mongoUrl,collection,data){
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  insertDocument(db,collection,data, function() {
		  db.close();
	  });
	});
}


//-----------------------------------------------------------------




var dohvati = function(kolekcija,query,callback){ 
	MongoClient.connect(mongoUrl, function(err, db) {
		console.log('uslo u konekciju :');
		
		console.log(kolekcija);
		assert.equal(null, err);
		var cursor = db.collection(kolekcija).find({});
		var result=[];
		
		cursor.each(function(err, doc) {
		  assert.equal(err, null);
		  if (doc != null) {
			  result.push(doc); 
			  
			 //console.dir(doc);   //radi
			 console.log(doc.ime);  //radi
		  } else {
				db.close();
				//console.log('izašlo iz konekcije');
				callback(result);
		  }
	   });
	});
}


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
	insertiraj(url,nalog,req.query);
	res.send({message:'Uspješno unesen servisni nalog'});
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
