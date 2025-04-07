module.exports = class entry{ 

  health(ctx){
    ctx.status = 200;
    ctx.body = { status: 'UP' };
  }

}