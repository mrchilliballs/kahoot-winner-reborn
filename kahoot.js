let electron;
if(!process.argv.includes("--disable-electron")){
  electron = require("electron");
}
const dotenv = require("dotenv"),
  express = require("express"),
  path = require("path"),
  ip = require("ip"),
  http = require("http"),
  got = require("got"),
  globals = require("./app/win/globals.js"),
  app = express();

dotenv.config({
  path: path.join(globals.mainPath, ".env")
});

const port = process.env.PORT || 2000,
  server = http.createServer(app);

server.once("error",()=>{
  // probably port already in use
  console.log("Port used, assuming kahoot-win already active");
});
console.log(ip.address() + ":" + port);
console.log("Using version " + require("./package.json").version);

require("./app/win/websocket.js")(server);
require("./app/win/router.js")(app);
require("./app/site/other.js")(app);

// 404 Page
app.use((req,res)=>{
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname,"public","404.html"));
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.json({error:"Not found",message:"Visit https://kahoot-win.com",status:404});
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("[404] I think you made a typo! Try going to https://kahoot-win.com/");
});

let started = false;
got({
  timeout: 2000,
  host: "localhost",
  protocol: "http:",
  port
}).then(() => {
  console.log("App already launched.");
  started = true;
}).catch(() => {
  require("./app/util/initializeDatabase.js")();
  server.listen(port);
  started = true;
});

if(electron){
  
}
