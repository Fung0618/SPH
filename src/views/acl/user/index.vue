<template>
  <div class="user">
    <!-- 用户组件 -->
    <div class="search">
      <el-input
        v-model="keyword"
        style="width: 10%"
        placeholder="用户名"
      ></el-input>
      <el-button
        @click="search"
        style="margin: 0px 10px"
        type="primary"
        icon="el-icon-search"
        >查询</el-button
      >
      <el-button @click="clearKeyword">清空</el-button>
    </div>
    <el-button
      @click="addOrUpdateOrdoAssign(0)"
      type="primary"
      style="margin-right: 10px"
      >添加</el-button
    >
    <el-button
      :disabled="!chooseUserList.length"
      type="danger"
      @click="banchRemove"
      >批量删除</el-button
    >
    <!-- 列表表格 -->
    <el-table
      v-loading="loading"
      @selection-change="handleSelectionChange"
      :data="userList"
      border
      style="width: 100%; margin: 20px 0px"
    >
      <el-table-column type="selection" prop="prop" label="label" width="80px">
      </el-table-column>
      <el-table-column align="center" type="index" label="序号" width="80px">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="200px">
      </el-table-column>
      <el-table-column prop="nickName" label="用户昵称" width="200px">
      </el-table-column>
      <el-table-column prop="roleName" label="权限列表" width="width">
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="180px">
      </el-table-column>
      <el-table-column prop="gmtModified" label="更新时间" width="180px">
      </el-table-column>
      <el-table-column align="center" prop="prop" label="操作" width="250px">
        <template slot-scope="{ row, $index }">
          <Hintbutton
            @click="addOrUpdateOrdoAssign(2, row)"
            title="设置角色"
            type="info"
            icon="el-icon-user-solid"
            size="mini"
          ></Hintbutton>
          <Hintbutton
            @click="addOrUpdateOrdoAssign(1, row)"
            title="修改用户"
            type="primary"
            icon="el-icon-edit"
            size="mini"
          ></Hintbutton>
          <el-popconfirm
            @onConfirm="removeUser(row)"
            @onCancel="$message({ message: '取消删除', type: 'warning' })"
            :title="`确定要删除${row.username}吗?`"
          >
            <Hintbutton
              title="删除用户"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
            ></Hintbutton>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--修改、添加 、分配用户的弹框 -->
    <el-dialog
      @close="cancelDialog"
      :title="title"
      :visible.sync="dialogFormVisible"
    >
      <!-- 修改、添加 用户的表单-->
      <el-form
        v-if="scene == 0 || scene == 1"
        :model="userInfo"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userInfo.username"
            :disabled="scene == 2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="userInfo.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="scene == 0" label="用户密码">
          <el-input v-model="userInfo.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 分配角色 的表单-->
      <el-form v-else label-width="100px">
        <el-form-item label="用户名">
          <el-input
            v-model="userInfo.username"
            :disabled="true"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-loading="checkboxLoading"
            v-show="!checkboxLoading"
            v-model="roleId"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="role in allRolesList"
              :label="role.id"
              :key="role.id"
              >{{ role.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="addOrUpdateOrAssignUser"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page="pageNo"
      :page-sizes="[3, 5, 7, 9]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 当前页码
      pageNo: 1,
      // 每页显示数
      pageSize: 3,
      // 总数量
      total: 10,
      // 存储用户列表的数组
      userList: [],
      // 勾选了的用户
      chooseUserList: [],
      // 控制弹框显示与隐藏的变量
      dialogFormVisible: false,
      // 新增用户的请求体对象(修改也可以用这个)
      userInfo: {
        nickName: "",
        password: "",
        username: "",
      },
      // 搜索关键字
      keyword: "",
      // 列表的loading效果
      loading: false,
      // 勾选框的loading效果
      checkboxLoading: false,
      // 控制弹框显示内容的参数
      // 0是新增 1是修改 2是分配权限
      scene: -1,
      // 全部角色列表
      allRolesList: [],
      // checkbox的控制参数
      isIndeterminate: false,
      checkAll: false,
      roleId: [], //用来保存勾选角色的id
      rules: {
        username: [
          { required: true, message: "用户名必须输入", trigger: "blur" },
          { min: 4, message: "长度不能小于4位", trigger: ["change", "blur"] },
        ],
        password: [
          { required: true, message: "密码必须输入", trigger: "blur" },
          { min: 6, message: "长度不能小于6位", trigger: ["change", "blur"] },
        ],
      },

      // #region 新增与修改的请求体参数
      // {
      //   "deleted": false,
      //   "gmtCreate": "2022-06-06T15:42:36.817Z",
      //   "gmtModified": "2022-06-06T15:42:36.817Z",
      //   "id": "",
      //   "nickName": "",
      //   "password": "",
      //   "roleName": "",
      //   "salt": "",
      //   "token": "",
      //   "username": ""
      // }
      // #endregion
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      // 这里发请求获取用户列表
      this.loading = true;
      let result = await this.$API.acl.users.getUserList(
        this.pageNo,
        this.pageSize,
        this.keyword
      );
      if (result.code == 20000) {
        this.userList = result.data.items;
        this.total = result.data.total;
        this.loading = false;
        return "ok";
      } else {
        this.$message.error("获取用户列表失败");
        this.loading = false;
        return Promise.reject(new Error("faile"));
      }
    },
    // 当前页面发生改变时出发的函数
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo;
      this.getUserList();
    },
    // 当前每页显示数发生改变时触发的函数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getUserList();
    },
    // 删除user
    async removeUser(row) {
      let result = await this.$API.acl.users.removeUserById(row.id);
      if (result.code == 20000) {
        //  删除成功 看看是不是删了本页的最后一个
        if (this.userList.length <= 1) {
          this.pageNo = this.pageNo == 1 ? 1 : this.pageNo - 1;
        }
        this.$message({ message: "删除成功", type: "success" });
        this.getUserList();
      } else {
        this.$message.error("删除失败");
      }
    },
    // 点击勾选时触发的方法
    handleSelectionChange(val) {
      this.chooseUserList = val;
    },
    // 批量删除
    async banchRemove() {
      this.$confirm("此操作会批量删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 点击了确认按钮，并且请求响应成功
          const idList = this.chooseUserList.map((item) => item.id);
          let result = await this.$API.acl.users.banchRemove(idList);
          if (result.code == 20000) {
            // 删除成功
            this.$message({ message: "批量删除成功", type: "success" });
            if (this.chooseUserList.length == this.userList.length) {
              this.pageNo = this.pageNo <= 1 ? 1 : this.pageNo - 1;
            }
            this.getUserList();
            return "ok";
          } else {
            // 响应成功，但是状态码不是20000
            this.$message({ message: "取消删除", type: "info" });
            return Promise.reject(new Error("faile"));
          }
        })
        .catch(() => {
          this.$message({ message: "取消删除", type: "info" });
        });
    },
    //点击新增 修改 分配权限时,触发的事件
    async addOrUpdateOrdoAssign(scene, row) {
      this.checkboxLoading = true;
      this.isIndeterminate = false; //一上来先不显示状态
      // 1.控制弹框的显示以及场景的切换
      this.dialogFormVisible = true;
      this.scene = scene;
      // 2.如果是分配权限需要发请求获取角色列表
      if (this.scene == 2) {
        this.userInfo = { ...row }; //用于回显
        // 发请求获取角色列表 并且请求与响应
        let result = await this.$API.acl.users.getAssignByUserId(row.id);
        if (result.code == 20000) {
          this.roleId = []; //先将勾选框绑定的选中数组置空
          // 获取列表成功
          this.allRolesList = result.data.allRolesList;
          // 将选中的角色放到勾选框绑定的选中数组中
          result.data.assignRoles.forEach((item) => {
            this.roleId.push(item.id);
          });
          this.checkboxLoading = false; //停止加载
          // 开始判断全选按钮的选择情况
          if (
            this.allRolesList.length != 0 &&
            this.roleId.length == this.allRolesList.length
          ) {
            this.isIndeterminate = false;
            this.checkAll = true;
          } else if (this.allRolesList.length == 0 || this.roleId.length == 0) {
            this.isIndeterminate = false;
            this.checkAll = false;
          } else {
            this.isIndeterminate = true;
            this.checkAll = false;
          }
        } else {
          // 获取列表失败
          this.$message.error("获取角色列表失败");
        }
      }
      if (this.scene == 1) {
        // 修改用户回显
        this.userInfo = { ...row };
      }
    },
    // 当点击全选时触发的事件
    handleCheckAllChange(val) {
      this.checkAll = val;
      // 无论全选和全不选都要去掉非全选状态
      this.isIndeterminate = false;
      if (val) {
        // 全选
        // 把所有的roleId保存起来
        this.allRolesList.forEach((item) => {
          this.roleId.push(item.id);
        });
      } else {
        // 全不选
        this.roleId = [];
      }
    },
    // 当勾选发生变化时触发的事件
    handleCheckedCitiesChange(val) {
      this.roleId = [...val];
      if (
        this.allRolesList.length != 0 &&
        this.roleId.length == this.allRolesList.length
      ) {
        this.isIndeterminate = false;
        this.checkAll = true;
      } else if (this.allRolesList.length == 0 || this.roleId.length == 0) {
        this.isIndeterminate = false;
        this.checkAll = false;
      } else {
        this.isIndeterminate = true;
        this.checkAll = false;
      }
    },
    // 点击弹框的取消按钮触发的回调
    cancelDialog() {
      this.userInfo = { ...this.$options.data().userInfo };
      if (this.scene == 0 || this.scene == 1) {
        this.$refs.ruleForm.clearValidate(); //清除校验的结果
      }
    },
    // 点击查询按钮触发的事件
    search() {
      this.pageNo = 1;
      this.getUserList();
    },
    // 点击清空触发的事件
    clearKeyword() {
      this.keyword = "";
      this.getUserList();
    },
    // 新增或者修改或者分配角色
    async addOrUpdateOrAssignUser() {
      let result = {};
      if (this.scene == 0 || this.scene == 1) {
        // 新增与修改需要表单验证
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            result = await this.$API.acl.users.addOrUpdateUser(this.userInfo);
            if (result.code == 20000) {
              // 请求成功, 业务成功
              this.dialogFormVisible = false;
              this.$message({
                message:
                  this.scene == 0
                    ? "新增用户成功"
                    : this.scene == 1
                    ? "修改用户成功"
                    : "分配角色成功",
                type: "success",
              });
              this.getUserList();
            } else {
              // 请求成功, 业务失败
              this.$message.error(
                this.scene == 0
                  ? "新增用户失败"
                  : this.scene == 1
                  ? "修改用户失败"
                  : "分配角色失败"
              );
            }
          } else {
            return false;
          }
        });
      } else {
        // 分配角色
        result = await this.$API.acl.users.toAssignUser({
          userId: this.userInfo.id,
          roleId: this.roleId.join(","),
        });
        if (result.code == 20000) {
          // 请求成功, 业务成功
          this.dialogFormVisible = false;
          this.$message({
            message:
              this.scene == 0
                ? "新增用户成功"
                : this.scene == 1
                ? "修改用户成功"
                : "分配角色成功",
            type: "success",
          });
          this.getUserList();
        } else {
          // 请求成功, 业务失败
          this.$message.error(
            this.scene == 0
              ? "新增用户失败"
              : this.scene == 1
              ? "修改用户失败"
              : "分配角色失败"
          );
        }
      }
    },
  },
  computed: {
    title() {
      return this.scene == 0
        ? "添加用户"
        : this.scene == 1
        ? "修改用户"
        : "设置角色";
    },
  },
};
</script>

<style scoped>
.user {
  margin: 30px;
}
.search {
  margin-bottom: 20px;
}
</style>