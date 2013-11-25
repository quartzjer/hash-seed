var fs = require("fs");
var tele = require("telehash");
var argv = require("optimist")
  .default("id", "./seed.json")
  .default("port", 42424)
  .boolean("v").describe("v", "verbose")
  .argv;

if(argv.v) tele.debug(console.log);

var port = parseInt(argv.port);

// load the pub/private key or create one
if(fs.existsSync(argv.id))
{
  init(require(argv.id));
}else{
  tele.genkey(function(err, key){
    fs.writeFileSync(argv.id, JSON.stringify(key, null, 4));
    init(key, mesh);
  });
}

function init(key)
{
  var seed = tele.hashname(key, {port:port});
  console.log(JSON.stringify({ip:seed.ip, port:seed.port, hashname:seed.hashname, pubkey:key.public}, null, 4));
  // optionally use a seeds file to accelerate mesh building
  if(argv.seeds)
  {
    require(argv.seeds).forEach(seed.addSeed, seed);
    seed.online(function(err){
      console.log((err?err:"connected to mesh seed peers"));
      if(err) process.exit(0);
    });
  }
}
