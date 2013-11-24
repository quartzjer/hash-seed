var fs = require("fs");
var tele = require("telehash");
var argv = require("optimist")
  .default("id", "./seed.json")
  .default("port", 42424)
  .default("mesh", "./hints.json")
  .boolean("v").describe("v", "verbose")
  .argv;

if(argv.v) tele.debug(console.log);

var port = parseInt(argv.port);

// optionally use a hints file to accelerate mesh building
var mesh = [];
if(fs.existsSync(argv.mesh))
{
  mesh = require(argv.mesh);
}

// load the pub/private key or create one
if(fs.existsSync(argv.id))
{
  init(require(argv.id), mesh);
}else{
  tele.genkey(function(err, key){
    fs.writeFileSync(argv.id, JSON.stringify(key, null, 4));
    init(key, mesh);
  });
}

function init(key, mesh)
{
  var seed = tele.hashname(key, {port:port});
  console.log(JSON.stringify({ip:seed.ip, port:seed.port, hashname:seed.hashname, pubkey:key.public}, null, 4));
  mesh.forEach(seed.addSeed, seed);
  seed.online(function(err){
    console.log((err?err:"connected to mesh seed peers"));
    if(err) process.exit(0);
  });

}
