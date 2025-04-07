const { execute } = require('../../library/db/methods');

module.exports = class homeServer{

  async test(id){
    // return "homeServer test";
    // console.log(await execute());
   return await execute('SELECT * FROM category where id = ?', [id]);
  }


  async all(){
    // return "homeServer all";
    // console.log(await execute());
    // ctx.body = await execute('SELECT * FROM category');
    return await execute('SELECT * FROM category');
  }

}