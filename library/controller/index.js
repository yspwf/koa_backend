const path = require('node:path');
const corePath = path.join(__dirname, '.');
const entryPath = process.cwd();

const { readDir, loaderFile} = require('../loaderUtile');

const ControllerObj = {};


const Controller = new Proxy(ControllerObj, {
    get: (target, property, receiver) => {
      return target[property];
    },
    set: (target, property, value, receiver) => {
      target[property] = value;
      return true;
    }
})

const EachController = (path='', controllers = []) => {
  controllers.length > 0 && controllers.forEach(ctlItem => {
    if(ctlItem.endsWith('.js')){
      const ctlName = ctlItem.split('.')[0];
      const ctlTemp = require(`${entryPath}/${path}/${ctlItem}`);
      ControllerObj[ctlName] = new ctlTemp();
    }
  })
}

module.exports = { EachController, Controller };