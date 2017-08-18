const http = require('http');
const fs = require('fs');

const urlParser = function(req,body){
  let url = req.url;
  let headers = req.url;
  let paths = [];
  let parameters = [];
  let params = {};
  if(typeof body == Object){
    if(Object.keys(body).length>0) body = JSON.parse(body);
  }
  if(url.indexOf("?")>-1) paths = url.slice(0,url.indexOf("?")).split("/");
  else paths = url.split("/");
  paths.splice(0,1);
  if(url.indexOf("?")>-1) parameters = url.slice(url.indexOf("?")+1).split("&");
  if(parameters instanceof Array){
    parameters.map(param=>{
      let keyValue = param.split("=");
      params[keyValue[0]] = keyValue[1];
    })
  }
  return{
    params : params,
    paths : paths,
    method : req.method,
    host : {},
    body : body.toString()
  }
}

let HttpServer = function(port){
  let getFunctions = {};
  let server = http.createServer();
  let staticFolder = "static/";
  const get = function(url,fct){
    getFunctions[url] = fct;
    return this;
  }
  const setStatic = function(doc){
      staticFolder = doc;
  }
  const start = function(){
    server.on('request',(req,res)=>{
      let request = urlParser(req,"");
      req.on('data',(body)=>{
        request = urlParser(req,body);
      })
      req.on('end',()=>{
        console.log('/'+request.paths[0]);
        if(getFunctions.hasOwnProperty('/'+request.paths[0])){
          getFunctions['/'+request.paths[0]].apply(this, [request,res]);
        }
        else{
          console.log(staticFolder+"."+req.url);
          let file = fs.readFileSync(staticFolder+"."+req.url);
          if(file){
            res.writeHead(200,{"content-type":"text/plain"});
            res.end(file,"binary");
          }
          else{
            res.writeHead(404,{"content-type":"text/html"});
            res.end("<h2>URL not mapped to a controller.</h2>");
          }
        }
      })
    })
    server.listen(port);
  }
  return{
    get : get,
    getFunctions : getFunctions,
    start : start,
    static : setStatic
  }
}

var app = new HttpServer(5000);
app.static("static/");
app.get("/home",function(req,res){
  res.writeHead(200,{"content-type":"text/html"});
  let html = fs.readFileSync("static/index.html","utf-8");
  res.end(html);
})

.get("/menu",function(req,res){
  res.writeHead(200,{"content-type":"application/json"});
  res.end(JSON.stringify(req));
})

.get("/user",function(req,res){
  res.writeHead(200,{"content-type":"application/json"});
  res.end(JSON.stringify(req));
})

app.start();
