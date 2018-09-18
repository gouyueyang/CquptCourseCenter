var https = require('https'),
    url = require('url'),
    getIO = require('socket.io'),
    fs = require('fs'),
    io = null;
var options = {  
   key: fs.readFileSync('./key/server.key'),
   ca: [fs.readFileSync('./key/ca.crt')],
   cert: fs.readFileSync('./key/server.crt')
};  
function startServer( route , hostName , port){
    function onRequest(req, res, io){
        var pathName = url.parse(req.url).pathname;
        route(pathName,req,res ,io);
    }
    var server = https.createServer(options,function(req , res){
         onRequest(req , res, io);
    }).listen(443);
    io = getIO(server,{path:'/waitWineMake'});
    io.sockets.on('connection',function(socket){
        socket.on('getUserId', function(data){
            console.log(data,999999);
            socket.join(data);
        });
    });
}
exports.start = startServer;