<template>
  <div class="role">
    <!-- 角色组件 -->
    <div class="search">
      <el-input
        v-model="keyword"
        style="width: 10%"
        placeholder="角色名称"
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
    <el-button @click="addRole" type="primary" style="margin-right: 10px"
      >添加</el-button
    >
    <el-button
      :disabled="!chooseRoleList.length"
      type="danger"
      @click="banchRemove"
      >批量删除</el-button
    >
    <el-table
      @selection-change="handleSelectionChange"
      v-loading="loading"
      :data="roleList"
      border
      style="width: 100%; margin: 20px 0px"
    >
      <el-table-column type="selection" prop="prop" label="label">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="80px">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称">
        <template slot-scope="{ row, $index }">
          <span v-show="!row.isShow">{{ row.roleName }}</span>
          <el-input
            :ref="row.id"
            v-show="row.isShow"
            v-model="roleInfo.roleName"
            size="mini"
            style="width: 80%; margin-right: 20px"
          ></el-input>
          <el-button
            @click="cancelUpdate(row)"
            v-show="row.isShow"
            type="warning"
            icon="el-icon-refresh"
            size="mini"
            >取消</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作">
        <template slot-scope="{ row, $index }">
          <Hintbutton
            @click="
              $router.push({
                name: 'RoleAuth',
                params: { id: row.id },
                query: { roleName: row.roleName },
              })
            "
            title="分配权限"
            type="info"
            icon="el-icon-user-solid"
            size="mini"
          ></Hintbutton>
          <Hintbutton
            @click="updateRole(row)"
            v-if="!row.isShow"
            title="修改角色"
            type="primary"
            icon="el-icon-edit"
            size="mini"
          ></Hintbutton>
          <Hintbutton
            @click="addOrUpdateRole"
            v-else
            title="确定"
            type="primary"
            icon="el-icon-check"
            size="mini"
          ></Hintbutton>
          <el-popconfirm
            @onConfirm="removeRole(row)"
            @onCancel="$message({ message: '取消删除', type: 'warning' })"
            :title="`确定要删除${row.roleName}吗?`"
          >
            <Hintbutton
              title="删除角色"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
            ></Hintbutton>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增角色弹框 -->
    <el-dialog
      @close="closeDialog"
      width="30%"
      title="添加角色"
      :visible.sync="dialogFormVisible"
    >
      <el-form label-position="top" label-width="auto">
        <el-form-item label="请输入新名称">
          <el-input
            ref="dialogInput"
            v-model="roleInfo.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateRole">确 定</el-button>
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
      // 获取到的roleList
      roleList: [],
      // 表格的loading变量
      loading: false,
      // 保存被勾选的行数据
      chooseRoleList: [],
      // 请求体对象
      roleInfo: {
        roleName: "",
      },
      // 控制弹框出现的变量
      dialogFormVisible: false,
      // 保存roleName的keyword变量
      keyword: "",
      // 控制弹框关闭是什么操作 0是除了点击保存  1是点击了保存
      type: 0,

      // #region
      //  {
      //   "deleted": false,
      //   "gmtCreate": "2022-06-06T15:42:36.777Z",
      //   "gmtModified": "2022-06-06T15:42:36.778Z",
      //   "id": "string",
      //   "remark": "string",
      //   "roleName": "string"
      // }
      // #endregion
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    //  获取角色列表
    async getRoleList() {
      this.loading = true;
      let result = await this.$API.acl.role.getRoleList(
        this.pageNo,
        this.pageSize,
        this.keyword
      );
      if (result.code == 20000) {
        // 获取成功
        this.roleList = result.data.items;
        this.total = result.data.total;
        this.loading = false;
      } else {
        this.$message.error("获取角色列表失败");
      }
    },
    // 当当前页发生改变时触发的函数
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo;
      this.getRoleList();
    },
    // 每页显示数发生改变时触发的函数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getRoleList();
    },
    // 移除role
    async removeRole(row) {
      let result = await this.$API.acl.role.removeRole(row.id);
      if (result.code == 20000) {
        // 请求成功 业务成功
        this.$message({ message: "删除成功", type: "success" });
        this.pageNo =
          this.pageNo <= 1
            ? 1
            : this.roleList.length <= 1
            ? this.pageNo - 1
            : this.pageNo;
        this.getRoleList();
      } else {
        // 请求成功 业务失败
        this.$message.error("删除失败");
      }
    },
    // 当行数据被勾选的时候触发的函数
    handleSelectionChange(val) {
      this.chooseRoleList = val;
    },
    // 批量删除
    async banchRemove() {
      try {
        await this.$confirm("此操作会批量删除用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const idList = this.chooseRoleList.map((item) => item.id);
        let result = await this.$API.acl.role.banchRemove(idList);
        if (result.code == 20000) {
          //  请求成功 业务成功
          this.$message({ message: "批量删除成功", type: "success" });
          if (this.chooseRoleList.length == this.roleList.length) {
            this.pageNo = this.pageNo == 1 ? 1 : this.pageNo - 1;
          }
          this.getRoleList();
        } else {
          //   请求成功 业务失败
          this.$message.error("批量删除失败");
        }
      } catch (error) {
        // 点击了取消
        this.$message({ message: "取消批量删除", type: "info" });
      }
    },
    // 点击修改按钮触发的回调
    updateRole(row) {
      this.$set(row, "isShow", true);
      this.roleInfo = { id: row.id, roleName: row.roleName };
      this.$nextTick(() => {
        this.$refs[row.id].focus();
      });
    },
    // 取消修改角色名
    cancelUpdate(row) {
      this.roleInfo = { ...this.$options.data().roleInfo };
      row.isShow = false;
      this.$message({ message: "取消修改角色名", type: "warning" });
    },
    // 关闭新增角色框时的回调
    closeDialog() {
      this.roleInfo = { ...this.$options.data().roleInfo };
      if (!this.type) {
        this.$message({ message: "取消添加", type: "warning" });
      }
    },
    // 点击添加按钮的回调
    addRole() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.dialogInput.focus();
      });
    },
    // 新增或者更新角色
    async addOrUpdateRole() {
      let result = await this.$API.acl.role.addOrUpdateRole(this.roleInfo);
      if (result.code == 20000) {
        this.type = 1;
        this.dialogFormVisible = false;
        this.getRoleList();
        this.$message({
          message: this.roleInfo.id ? "修改成功" : "新增成功",
          type: "success",
        });
        this.roleInfo = { ...this.$options.data().roleInfo };
      } else {
        this.$message.error(this.roleInfo.id ? "修改失败" : "新增失败");
      }
    },
    // 点击清理触发的回调
    clearKeyword() {
      this.keyword = "";
      this.getRoleList();
    },
    // 点击查询触发的函数
    search(){
      this.pageNo = 1
      this.getRoleList()
    }
  },
};
</script>

<style scoped>
.role {
  margin: 20px;
}
.search {
  margin-bottom: 20px;
}
</style>