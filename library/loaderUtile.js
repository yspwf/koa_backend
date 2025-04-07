const fs = require('node:fs'); 

const readDir = path => { return fs.readdirSync(path) };

const loaderFile = filePath => { return require(filePath) };


const moduleInitial = (moduleArray) => {
  moduleArray.forEach(element => {
    const CtrollerArr = readDir(`${entryPath}/${element}/controller`);
    CtrollerArr.forEach(ctlItem => {
      if(ctlItem.endsWith('.js')){
        const ctlName = ctlItem.split('.')[0];
        // const ctlTemp = require(`${entryPath}/${element}/controller/${ctlItem}`);
        const ctlTemp = loaderFile(`${entryPath}/${element}/controller/${ctlItem}`);
        ControllerObj[ctlName] = new ctlTemp();
      }
    })
  });
}

module.exports = { moduleInitial, readDir, loaderFile};