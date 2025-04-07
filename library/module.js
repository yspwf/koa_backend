class moduleObjectOpration {
  constructor() {
      this.moduleArr = ['./src'];
  }

  add(path) {
    this.moduleArr.push(path);
  }

  getAll(){
    return this.moduleArr;
  }
}

const moduleObject = new moduleObjectOpration();

const register = function (module) {
    return new Promise((resolve, reject) => {
      moduleObject.add(module);
      resolve();
    })
}
// exports.register = register;
module.exports = {moduleObject, register};