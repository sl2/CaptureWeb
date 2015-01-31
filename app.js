/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var phantom = require('node-phantom');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var webimage;

app.get('/', function(req, res){
    res.render('index', { title: 'Express' });
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io');
var sio = io.listen(server, {'log level': 0});

sio.sockets.on('connection', function (socket) {
    socket.on('sv_capture_web', function(d){
        webCapB64(d.url, d.vw, d.vh, d.cw, d.ch); 
    });

    function webCapB64(url, viewW, viewH, clipW, clipH){
        phantom.create(function(err,ph){
            ph.createPage(function(err,page){
                page.set('viewportSize',{width:viewW,height:viewH},function(err){
                    page.set('clipRect',{width:clipW,height:clipH},function(err){
                        page.open(url,function(err, status){
                            console.log(status);
                            page.renderBase64('PNG', function(err, image){
                                socket.emit('cl_display_web_image', { image:image });
                            });
                        });
                    });
                });
            });
        });
    }

});    





