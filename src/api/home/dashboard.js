// 这里写主页的接口

import mockRequests from '@/utils/mockRequest'

export const getHomeData = () => mockRequests({url:'/home/list',method:'get'})

