var app = require("sys");
http = require("http");
path = require("path");
url = require("url");
filesys = require("fs")

http.createServer(function (request, response) {
	var my_path = url.parse(request.url).pathname;
	var full_path = path.join(process.cwd(), my_path); //CURRENTWORKINGDIRECTORY -> process.cwd()
	path.exists(full_path, function(exists){
		if (!exists) {
			response.writeHeader(404, {"Content-Type":"tex/plain"});
			response.write("Not found 404.");
			response.end();
		}else{
			filesys.readFile(full_path, "binary", function(err, file){
				if (err) {
					response.writeHeader(500,{"Content-Type":"text/plain"});
					response.write(err,"\n");	
					response.end();
				}else{
					response.writeHeader(200);
					response.write(fie, "binary")
					response.end();
				};
				
			});
		};
	});
	

}).listen(3000);

app.puts("Server running");
