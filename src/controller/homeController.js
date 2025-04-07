// exports =  class home{

//   test(){
//     console.log('home test')
//   }

// }


const { Server } = require('../../library/server');
// console.log("Server", Server)
module.exports = class home{

    async test(ctx){
      // console.log(await Server.homeServer.test());
      // ctx.body = await execute('SELECT * FROM category where id = ?', [1]);
      ctx.body = await Server.homeServer.test(1);
    }


    async all(ctx){
      // console.log(await execute());
      // ctx.body = await execute('SELECT * FROM category');
      ctx.body = await Server.homeServer.all();
    }
  
  }