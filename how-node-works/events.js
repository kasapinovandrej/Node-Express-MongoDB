const EventEmitter = require("events");
const http = require("http");
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sales();
myEmitter.on("newSale", () => {
  console.log("Cosutmer name: Andrej");
});
myEmitter.on("newSale", (stock) => {
  console.log(`Stock: ${stock}`);
});
myEmitter.emit("newSale", 7);

///////////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("REQUEST RECEIVED");
  res.end("Req recieved");
});

server.on("request", (req, res) => {
  console.log("REQUEST no2");
});

server.on("close", () => {
  console.log("close");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("SERVER STARTED");
});
