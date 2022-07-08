// 这里模拟首页dashboard数据的接口
// 先引入假数据
const data = require('./data.json')
module.exports = [
    {
        url: '/home/list',
        type: 'get',
        response: config => {
            return {
                code: 20000,
                data //直接将假数据昨晚返回值
            }
        }
    }
]