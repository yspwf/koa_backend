const path = require('node:path');
const corePath = path.join(__dirname, '.');
const entryPath = process.cwd();

const app = require(`${corePath}/app`);

const router = require(`${corePath}/router`);
exports.router = router;

const config = require(`${entryPath}/config.js`);
const {port} = config;

const { readDir, loaderFile} = require(`${corePath}/loaderUtile`);


const { useObject, use} = require(`${corePath}/middleware`);
exports.use = use;

const {moduleObject, register} = require(`${corePath}/module`);
exports.register = register;

const { EachController } = require('./controller')
const { EachServer } = require('./server')

// process.nextTick()
process.nextTick(function(){
 

  moduleArr = moduleObject.getAll();
  moduleArr.forEach(modulItem => {
      const ctrFiles = readDir(`${modulItem}/controller`);
      const ctlResult = EachController(`${modulItem}/controller`, ctrFiles);
  })

  moduleArr.forEach(modulItem => {
    const serverFiles = readDir(`${modulItem}/server`);
    const serverResult = EachServer(`${modulItem}/server`, serverFiles);
  })
})

const HttpException = require('../httpError');

const bootstrap = (fn) => {
  process.nextTick(()=>{
    useMiddlewareResult = useObject.getAll();
    // console.log(useMiddlewareResult);
    useMiddlewareResult.forEach(item => {
      // console.log(item())
      app.use(item);
    });

// app.use(
//   async (ctx, next)=>{
//     try{
//         await next()
//         console.log('error', '1231321')
//     }catch(error){
//       console.log('error', error)
//         if(error instanceof HttpException){
//           ctx.body = error.msg
//         }
//     }
//   }
// )


    fn && fn();
    app.use(router.routes()).use(router.allowedMethods());
    const server = app.listen(port, () => {
      console.log(`server is starting with port: ${port}`)
    })

    process.on('SIGINT', async () => {
      console.log('Received SIGINT. Gracefully shutting down all components...');
      server.close(() => {
        console.log('Product Service stopped');
        process.exit(0);
      });
      // process.exit(0);
    });
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM. Gracefully shutting down all components...');
      server.close(() => {
        console.log('Product Service stopped');
        process.exit(0);
      });
      // process.exit(0);
    })

  })
}

exports.bootstrap = bootstrap;
