// const path = require('node:path');
// const corePath = path.join(__dirname, '.');
// const entryPath = process.cwd();

// const { readDir, loaderFile} = require('../loaderUtile');

// const ServerObj = {};
// const servers = readDir(`${entryPath}/src/server`)

// servers.forEach(ctlItem => {
//   if(ctlItem.endsWith('.js')){
//     const ctlName = ctlItem.split('.')[0];
//     const ctlTemp = require(`${entryPath}/src/server/${ctlItem}`);
//     ServerObj[ctlName] = new ctlTemp();
//   }
// })

// const Server = new Proxy(ServerObj, {
//   get: (target, property, receiver) => {
//     return target[property];
//   },
//   set: (target, property, value, receiver) => {
//     target[property] = value;
//     return true;
//   }
// })

// module.exports = { Server };



const path = require('node:path');
const corePath = path.join(__dirname, '.');
const entryPath = process.cwd();

const { readDir, loaderFile} = require(`${corePath}/../loaderUtile`);
const ServerObj = {};

const Server = new Proxy(ServerObj, {
    get: (target, property, receiver) => {
      return target[property];
    },
    set: (target, property, value, receiver) => {
      target[property] = value;
      return true;
    }
})

const EachServer = (path='', servers = []) => {
  servers.length > 0 && servers.forEach(serverItem => {
    if(serverItem.endsWith('.js')){
      const serverName = serverItem.split('.')[0];
      const serverTemp = require(`${entryPath}/${path}/${serverItem}`);
      ServerObj[serverName] = new serverTemp();
    }
  })
}

module.exports = { EachServer, Server };