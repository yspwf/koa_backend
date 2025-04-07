// exports =  class home{

//   test(){
//     console.log('home test')
//   }

// }


const { execute } = require('../../library/db/methods');
module.exports = class user{

    async test(ctx){
      // console.log(await execute());
      ctx.body = await execute('SELECT * FROM user where id = ?', [1]);
      
    }


    async all(ctx){
      // console.log(await execute());
      ctx.body = await execute('SELECT * FROM user');
    }
  
  }