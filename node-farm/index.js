const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');

// Blocking SYNCHRONOUS WAY
// const text = fs.readFileSync("./txt/input.txt", "utf-8");
// const textOut = `This is what we know about the avocado: ${text}. \nCreated on ${new Date(
//   Date.now()
// )}`;
// fs.writeFileSync("./text/output.txt", textOut);

// fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
//   console.log(data);
// });

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   const param = data1;
//   fs.readFile(`./txt/${param}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n ${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written :D");
//       });
//     });
//   });
// });

const http = require('http');
const url = require('url');
const slugify = require('slugify');

const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/card.html`,
  'utf-8'
);
const productTemplate = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/' || pathname === '/overview') {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(cardTemplate, el))
      .join('');
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const output = overviewTemplate.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } else if (pathname === '/product') {
    const productId = query.id;
    const product = dataObj[productId];
    const output = replaceTemplate(productTemplate, product);
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on prort 8000');
});
