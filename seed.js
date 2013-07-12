var fs = require("fs");
var tele = require("telehash");

var network = process.argv[2];
var port = parseInt(process.argv[3] || 42424);

if(!network)
{
  console.log("first argument is the name of the network to seed for");
  process.exit(1);
}

// load the pub/private key or create one
if(fs.existsSync("./seed.json"))
{
  init(require("./seed.json"));
}else{
  tele.genkey(function(err, key){
    fs.writeFileSync("./seed.json", JSON.stringify(key, null, 4));
    init(key);
  });
}

function init(key)
{
  var seed = tele.hashname(network, key, {port:port});
  console.log(JSON.stringify({ip:seed.ip, port:seed.port, network:seed.network, hashname:seed.hashname, pubkey:key.public}, null, 4));
}
