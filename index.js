const { rejects } = require("assert");
const fs = require("fs");
const { resolve } = require("path");
const path = require("path");
const fsPromises = require("fs").promises;
const clc = require("cli-color");
const userPath = process.argv[2];
let validateFromConsole = process.argv[3];

console.log('process', process.argv[3]);
console.log('validate', validateFromConsole);

const {
  validateUrl,
  browseDirectory,
  validatePath,
  objectLinks,
} = require("./functions.js");

let respuesta = {
    data: [],
    errors: ''
  }

function mdLinks(path = "", options = { validate: false }) {
 const {validate} = options
  console.log('este es VALIDATE', validate);
  return new Promise((resolve, reject) => {
    const pathAbsolute = validatePath(userPath);
    const readDirectory = browseDirectory(pathAbsolute);
    respuesta.data = objectLinks(readDirectory).then((resolve) => {
      return resolve;
    });
    if (validate) {
      let urlValidatedList = respuesta.data.map((objeto) =>
        validateUrl(objeto.href)
          .then((res) => {
            objeto.status = res.statusCode;
            objeto.ok =
              res.statusCode >= 200 && res.statusCode <= 399 ? "ok" : "fail";
          })
          .catch((error) => {
            objeto.status = error.code;
            objeto.ok = "fail";
          })
      );
      Promise.all(urlValidatedList).then(() => {
        resolve(respuesta.data);
      });
    } else {
      if (!respuesta.errors) {
        resolve(respuesta.data);
      } else {
        reject(respuesta.errors);
      }
    }
  });
}

mdLinks("./DirectorioPrueba", {validate: validateFromConsole})
  .then((links) => console.log("links: ", links))
  .catch(console.error);

