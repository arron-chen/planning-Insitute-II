const Koa = require('koa')
const Router = require('koa-router')
const Boom = require('boom')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

// 设置代理端口
const Port = 3001

app.use(router.routes())
app.use(router.allowedMethods({
  throw: true,
  notImplemented: () => new Boom.notImplemented(),
  methodNotAllowed: () => new Boom.methodNotAllowed()
}))

app.use(bodyParser())

// 数据模拟返回
// ------- api 接口模拟 start -------

const menuApi = require('./menulist')
router.get('/api/menulist', async (ctx, next) => {
  ctx.body = menuApi
  await next()
})
// ------- api 接口模拟 end -------

// todo -> 添加接口模拟api按照上面格式

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx)
})

app.listen(Port)

console.log(`Mock Server is running at http://localhost:${Port} port...`)
