class Controller{
  constuctor(){

  }
}

class reservationController{
  constructor(){
    this.mapping = "/home/{name}"
  }
  GET(req){
    console.log("GET");
    return JSON.stringify(req);
  }
  POST(req){
    console.log("POST");
    return JSON.stringify(req);
  }
  PUT(req){
    console.log("PUT");
    return JSON.stringify(req);
  }
  DELETE(req){
    console.log("DELETE");
    return JSON.stringify(req);
  }
}

let keys = Object.getOwnPropertyNames((Object.getPrototypeOf(new reservationController())));
let r = new reservationController();
console.log(r.mapping);

keys.forEach(k=>{
  let obj = {};
  let fct = undefined;
  if(k!="constructor"){ fct = reservationController.prototype[k].toString(); reservationController.prototype[k]()}
  if(fct){
    let params = fct.slice(fct.indexOf('(')+1,fct.indexOf(')')).split(',');
    obj[k] = params;
    console.log(obj);
  }
})
