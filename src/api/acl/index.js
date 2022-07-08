// 这里整合所有的acl模块下的接口

import * as users from './users'
import * as role from './role'
import * as permission from './permission'

export default {
    users,
    role,
    permission
}