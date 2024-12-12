// https://dog.ceo/api/breeds/list/all
// https://dog.ceo/api/breed/hound/images
// https://dog.ceo/api/breed/hound/images/random/3

const fs = require("fs");

// fs.readFile(`${__dirname}/dog.txt`, "utf-8", (err, data) => {
//   fetch(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => res.json())
//     .then((res) => {
//       if (res.status === "error") {
//         console.log("ERROR", res.message);
//         return;
//       }
//       fs.writeFile("dog-imag.txt", res.message, (err) => {
//         console.log("aa", err);
//       });
//     })
//     .catch((err) => {
//       console.log("ERROR", err);
//     });
// });
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        reject(err || "I could not find thet file! 😒");
      }
      resolve(data);
    });
  });
};
const writeFilePromise = (fileName, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) reject(err || "Mile nesto zajebo");
      resolve("success");
    });
  });
};
(async () => {
  try {
    const breed = await readFilePromise(`${__dirname}/dog.txt`);
    const prom1 = fetch(
      `https://dog.ceo/api/breed/${breed}/images/random`
    ).then((el) => el.json());
    const prom2 = fetch(
      `https://dog.ceo/api/breed/${breed}/images/random`
    ).then((el) => el.json());
    const prom3 = fetch(
      `https://dog.ceo/api/breed/${breed}/images/random`
    ).then((el) => el.json());
    const all = await Promise.all([prom1, prom2, prom3]);
    const images = all.map((el) => el.message);
    console.log(images);
    // const responseData = await fetch(
    //   `https://dog.ceo/api/breed/${breed}/images/random`
    // );
    // const res = await responseData.json();
    // if (res.status === "error") {
    //   throw new Error(res.message);
    // }
    if (all.some((el) => el.status === "error")) {
      throw new Error(res.message);
    }
    // await writeFilePromise("dog-imag.txt", res.message);
    await writeFilePromise("dog-imag.txt", images.join("\n"));
  } catch (err) {
    console.log("ERROR>>>>", err);
  }
})();
