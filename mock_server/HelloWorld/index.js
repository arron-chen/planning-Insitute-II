const Mock = require('mockjs')

// 根据mock api来模拟数据
const data = Mock.mock({
  'list|1-10': [{
    'id|+1': 1,
    imgUrl: Mock.Random.image('200x100')
  }],
  'template': '<el-button type="primary">按钮</el-button>'
})

// 构造返回mock对象
module.exports = {
  msg: 'mock hello api works',
  data: data
}
