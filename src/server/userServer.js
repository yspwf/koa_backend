module.exports = class userServer{

  async test(){
    return "userServer test";
    // console.log(await execute());
    // ctx.body = await execute('SELECT * FROM category where id = ?', [1]);
    
  }


  async all(){
    return "userServer all";
    // console.log(await execute());
    // ctx.body = await execute('SELECT * FROM category');
  }

}