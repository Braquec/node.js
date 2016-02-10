var http = require("http");
var sys = require("sys");
var url = require("url");
var path = require("path");
var fs = require("fs")
var events = require("events");
var fcbook_client = http.createClient(80,"graph.facebook.com");
var fcbook_event  = new events.EventEmitter();


function get_data(){                      
    //sintax request('GET',get_url,{host:host_url})
    var request = fcbook_client.request("GET","/19292868552",{"host" : "graph.facebook.com"});  
    request.addListener("response", function(response){
        var body = "";
        response.addListener("data", function(data){
            body += data;
        });

        request.addListener("end", function(){
            var data = JSON.parse(body);
            fcbook_event.emit("data", String(data.likes));
        });
    }); 
    request.end();
}

http.createServer(function(request, response){
    var my_path = url.parse(request.url).pathname;
    if (my_path == "/getdata" ) {
        var listener = fcbook_event.once("data", function (data) {
            sys.puts("Listener!");
            response.writeHeader(200,{"Content-type": "text/plain"});
            response.write(data);
            response.end();
        });
    }else{
        load_file(my_path, response);
    }
}).listen(8000);
setInterval(get_data, 5000);
sys.puts("Server running!");

function load_file (my_path, response) {
    var path = require("path")
    var full_path = path.join(process.cwd(),my_path);
    fs.exists(full_path,function(exists){
        if(!exists){
            response.writeHeader(404, {"Content-Type": "text/plain"});  
            response.write("404 Not Found\n");  
            response.end();
        }
        else{
            fs.readFile(full_path, "binary", function(err, file) {  
                 if(err) {  
                     response.writeHeader(500, {"Content-Type": "text/plain"});  
                     response.write(err + "\n");  
                     response.end();  
                
                 }  
                 else{
                    response.writeHeader(200);  
                    response.write(file, "binary");  
                    response.end();
                }
                      
            });
        }
    });
}
