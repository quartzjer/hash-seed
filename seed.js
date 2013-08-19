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
    init(key);
  });
}

function init(key)
{
  var seed = tele.hashname(key, {port:port});
  console.log(JSON.stringify({ip:seed.ip, port:seed.port, hashname:seed.hashname, pubkey:key.public}, null, 4));
}
