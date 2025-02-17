const fs = require("fs");
const crypto = require("crypto");

setTimeout(() => {
  console.log("Timer 1 finished");
}, 0);

setImmediate(() => {
  console.log("Immediate 1 finished");
});

const mile = fs.readFile(`./test-file.txt`, "utf-8", (err, data) => {
  console.log("I/O finished");
  setTimeout(() => {
    console.log("Timer 2 finished");
  }, 0);
  setTimeout(() => {
    console.log("Timer 3 finished");
  }, 3000);
  setImmediate(() => {
    console.log("Immediate 2 finished");
  });

  process.nextTick(() => console.log("NEXT TICK"));
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log("ENCRIPTED");
  });
});

console.log("TOP LEVEL CODE");
