var fs = require("fs");
var tele = require("telehash");
var argv = require("optimist")
  .usage("Usage: $0 nameofnetwork")
  .default("id", "./seed.json")
  .default("port", 42424)
  .boolean("v").describe("v", "verbose")
  .demand(1).argv;

if(argv.v) tele.debug(console.log);

var network = argv._[0].toString();
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
  var seed = tele.hashname(network, key, {port:port});
  console.log(JSON.stringify({ip:seed.ip, port:seed.port, network:seed.network, hashname:seed.hashname, pubkey:key.public}, null, 4));
}
