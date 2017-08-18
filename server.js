const fs = require('fs');

var Database = function(url){
  var cache = JSON.parse(fs.readFileSync(url,"utf-8")).document;
  if(typeof cache != Array) cache = [];
  let autoCommit = false;
  let commit = function(){
    let obj = {};
    obj.document = cache;
    let data = JSON.stringify(obj);
    fs.writeFileSync("db.json",data)
  }
  let setAutoCommit = function(state){
    autoCommit = state;
  }
  let isAutoCommit = function(){
    return autoCommit;
  }
  let findOne = function(obj){
   return cache.filter((e)=>{
     let test = false;
     for(key in obj){
       test = (obj[key]==e[key]);
     }
     return test;
    })
  }
  let findAll = function(){
    return cache;
  }
  let save = function(obj){
    cache.push(obj);
    if(isAutoCommit()) commit();
  }
  let remove = function(obj){
   cache.map((e,i)=>{
     let test = false;
     for(key in obj){
       test = (obj[key]==e[key]);
     }
     if(test) cache.splice(i,1);
   })
   if(isAutoCommit()) commit();
  }
  return {
    find : findOne,
    findAll : findAll,
    save : save,
    delete : remove,
    commit : commit,
    setAutoCommit : setAutoCommit,
    isAutoCommit : isAutoCommit
  }
}

let db = new Database("db.json");
db.save({"name":"dio"});
db.commit();
console.log(db.findAll());
