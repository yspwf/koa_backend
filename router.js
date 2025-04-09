const {router} = require('./library');
const {Controller} = require('./library/controller');
const HttpException = require('./httpError');


const appApi = router.prefix('/api');
router.get('/promotion/test', Controller.promotionController.home)
router.get('/product/test', Controller.productController.home)
router.get('/home/test', Controller.homeController.test)
router.get('/home/all', Controller.homeController.all)
router.get('/user/test', Controller.userController.test)
router.get('/user/all', Controller.userController.all)
router.get('/health', Controller.entryController.health)

router.get('/product/list/:id', Controller.productController.getProduct)
router.get('/product/list', Controller.productController.homelist)

// router.get('/product/:id', async (ctx, next)=>{
//       try{
//           await next()
//           console.log('error', '1231321')
//       }catch(error){
//         console.log('error', error)
//           if(error instanceof HttpException){
//             ctx.body = error.msg
//           }
//       }
//     }, Controller.productController.getProduct)