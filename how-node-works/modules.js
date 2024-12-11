// console.log(arguments);
// console.log(require("module").wrapper);

const C = require("./test-module-1");
const { add, devide, multiply } = require("./test-module-2");

const calc1 = new C();
console.log(calc1.add(5, 1));

console.log(multiply(2, 3));

//caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
