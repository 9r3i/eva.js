/**
 * eva.js
 * ~ eva client script
 * authored by 9r3i
 * https://github.com/9r3i/eva.js
 * started at december 8th 2023
 * continued at january 13th 2024 - v1.1.0
 *   - replace gaino to browser fetch -- [stand-alone]
 *   - add method parse for parsing json
 */
;function eva(c){
/* the version */
Object.defineProperty(this,'version',{
  value:'1.1.0',
  writable:false,
});
c=typeof c==='object'&&c!==null?c:{};
/* default config */
this.config={
  host:'/api/eva/',
  method:'POST',
  contentType:'application/json',
  accept:'application/vnd.eva+json',
  token:'___EVA_API_TOKEN___',
  apiVersion:'1.0.1',
  authentication:'___EVA_AUTH_CODE___',
};
/* initialize config */
for(let i in this.config){
  if(c.hasOwnProperty(i)){
    this.config[i]=c[i];
  }
}
/* request */
this.request=async function(body,opt){
  opt=typeof opt==='object'&&opt!==null?opt:{};
  let config={
    method:this.config.method,
    headers:{
      'Content-Type': this.config.contentType,
      'Accept': this.config.accept,
      'Authorization': 'Bearer '+this.config.token,
      'X-Eva-Api-Version': this.config.apiVersion,
    },
    /* gaino will automatically convert body to
       what Content-Type body is */
    body:body,
  },
  host=this.config.host;
  if(typeof this.config.authentication==='string'
    &&this.config.authentication.match(/^eva1\./)){
    config.headers['Authentication']=this.config.authentication;
  }
  /* head, upload, download only works on gaino */
  if(opt.hasOwnProperty('head')){
    config.head=opt.head;
  }
  if(opt.hasOwnProperty('upload')){
    config.upload=opt.upload;
  }
  if(opt.hasOwnProperty('download')){
    config.download=opt.download;
  }
  if(opt.hasOwnProperty('headers')
    &&typeof opt.headers==='object'
    &&opt.headers!==null){
    for(let i in opt.headers){
      config.headers[i]=opt.headers[i];
    }
  }
  if(body instanceof FormData){
    delete config.headers['Content-Type'];
  }else if(config.headers['Content-Type']=='application/json'){
    config.body=JSON.stringify(body);
  }
  /**
   * body will automatically be a query get if using gaino
   * while fetch method wont work properly
   */
  if(config.method=='GET'){
    if(typeof body==='object'&&body!==null){
      if(body.hasOwnProperty('query')){
        host+='?query='+config.body.query;
      }else if(body.hasOwnProperty('queries')){
        host+='?queries='+config.body.queries;
      }
    }
    let res=await fetch(host).then(r=>r.text());
    return res;
  }else{
    let res=await fetch(host,config).then(r=>r.text());
    return res;
  }
};
/* json parse */
this.parse=function(s){
  let r=null;
  try{
    r=JSON.parse(s);
  }catch(e){
    r=s;
  }
  return r;
};
/* temporary method */
this.temp=function(){
  return arguments;
};
};
