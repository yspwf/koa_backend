class useMiddlewareOpration {
  constructor() {
      this.useMiddleware = [];
  }

  add(path) {
    this.useMiddleware.push(path);
  }

  getAll(){
    return this.useMiddleware;
  }
}

const useObject = new useMiddlewareOpration();
// export.useObject = useObject;

const use = function (func) {
  useObject.add(func);
  // return new Promise((resolve, reject) => {
  //   useObject.add(func);
  //   resolve();
  // })
}

// exports.use = use;
module.exports = {useObject, use};