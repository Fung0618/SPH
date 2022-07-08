<template>
  <div class="roleAuth">
    <!-- 角色授权树形组件 -->
    <el-input
      v-model="roleInfo.roleName"
      style="margin-bottom: 30px"
      :disabled="true"
    ></el-input>
    <el-tree
      @check="checkedChange"
      :data="data"
      show-checkbox
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :props="defaultProps"
    >
    </el-tree>
    <div style="margin-top: 10px">
      <el-button type="primary" @click="doAssign">保存</el-button>
      <el-button @click="$router.push({ path: '/acl/role' })">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleInfo: {
        id: "",
        roleName: "",
      },
      // 树形结构绑定的数据
      data: [],
      // 默认展开的节点数组
      defaultExpandedKeys: [],
      // 默认勾选的节点
      defaultCheckedKeys: [],
      // 最新勾选中的keys
      lastCheckedKeys: [],
      // 显示的字段 children字段位展开节点 label字段为节点显示的名称字段
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  mounted() {
    this.roleInfo = { ...this.$route.query, ...this.$route.params };
    this.getPermissionByRoleId();
  },
  methods: {
    //  根据roleId获取菜单
    async getPermissionByRoleId() {
      let result = await this.$API.acl.permission.getPermissionByRoleId(
        this.roleInfo.id
      );
      if (result.code == 20000) {
        this.data = result.data.children; //赋值
        // 将全部id筛选以及选中的id出来，因为默认全部节点默认展开
        this.getAllAndCheckedIds(result.data.children);
      } else {
        this.$message.error("获取列表失败");
      }
    },

    // 将data获取全部id以及选中的id的方法
    getAllAndCheckedIds(arr) {
      arr.forEach((item) => {
        this.defaultExpandedKeys.push(item.id);
        if (item.select) {
          this.defaultCheckedKeys.push(item.id);
        }
        if (item.children.length) {
          this.getAllAndCheckedIds(item.children);
        }
      });
    },

    // 当复选框被点击时触发的事件
    // Node是被点击的节点对象(点击时状态还没发生改变的的时候)
    // checkedKeys当前被选中的节点数组
    checkedChange(Node, { checkedKeys,halfCheckedKeys  }) {
      this.lastCheckedKeys = [...checkedKeys,...halfCheckedKeys];
    },
    //保存修改操作
    async doAssign() {
      const permissionId = this.lastCheckedKeys.join(",");
      let result = await this.$API.acl.permission.doAssignByRoleId(
        this.roleInfo.id,
        permissionId
      );
      if(result.code == 20000){
        //   保存成功
        this.$message({message:'分配权限成功',type:'success'})
        this.$router.push({path:'/acl/role'})
      }else{
        this.$message.error('分配权限失败')
      }
    },
    
  },
};
</script>

<style scoped>
.roleAuth {
  margin: 30px;
}
</style>