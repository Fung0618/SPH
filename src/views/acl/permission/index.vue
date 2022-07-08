<template>
  <div class="permission">
    <!-- 菜单组件 -->
    <!--  展开行的keys数组 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :expand-row-keys="expandRowKeys"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="code" label="权限值" width="width">
      </el-table-column>
      <el-table-column
        prop="toCode"
        label="跳转权限值"
        width="width"
      ></el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <Hintbutton
            @click="addPermission(row)"
            :disabled="row.level == 4"
            :title="row.level == 3 ? '添加功能' : '添加菜单'"
            type="primary"
            icon="el-icon-plus"
            size="mini"
          ></Hintbutton>
          <Hintbutton
            @click="updatePermission(row)"
            :disabled="row.level == 1"
            :title="row.level == 4 ? '修改功能' : '修改菜单'"
            type="warning"
            icon="el-icon-edit"
            size="mini"
          ></Hintbutton>
          <el-popconfirm
            @onCancel="$message({ message: '取消删除', type: 'warning' })"
            @onConfirm="removePermission(row)"
            :title="`确定要删除${row.name}吗？`"
          >
            <Hintbutton
              :disabled="row.level == 1"
              title="删除菜单"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
            ></Hintbutton>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加与修改菜单的dialog -->
    <el-dialog
      @close="closeDialog"
      :title="title"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="permissionInfo"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          v-if="permissionInfo.level >= 3 && scene"
          label="父级名称"
        >
          <el-input
            v-model="pName"
            :disabled="true"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name" label="名称">
          <el-input v-model="permissionInfo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="功能权限值">
          <el-input v-model="permissionInfo.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="permissionInfo.level == 4" label="跳转路由权限值">
          <el-input
            v-model="permissionInfo.toCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdatePermission"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      // 展开的keys
      expandRowKeys: [],
      // 控制表格的loading效果
      loading: false,
      // 控制弹框显示与隐藏的变量
      dialogFormVisible: false,
      // 场景控制变量 true为添加 false为修改
      scene: true,
      // 控制弹框是点击保存关闭的还是其他操作关闭的
      // 0为点击除了保存外关闭的  1是点解了保存按钮后关闭的
      closeFlag: 0,
      // 新增或者修改的请求体对象
      permissionInfo: {
        code: "", // 权限分配值
        name: "", //名称
        level: "", //当前节点的等级
        pid: "", // 父节点的id
        select: false,
        toCode: "", //路由跳转权限添加功能时附上
        type: 1, //添加一级、二级菜单时候为1 添加功能时为2
      },
      // 用来记录父节点的名称
      pName: "",
      //  验证规则
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [
          { required: true, message: "请输入功能权限值", trigger: "blur" },
        ],
      },
      // #region
      //         {
      //   "code": "",  权限分配值
      //   "gmtCreate": "2022-06-06T15:42:36.716Z",
      //   "gmtModified": "2022-06-06T15:42:36.716Z",
      //   "id": "string", // 新增不需要
      //   "level": 0,  // 当前新增的菜单是需要几级分类
      //   "name": "",// 菜单名称
      //   "pid": "", // 父节点id
      //   "select": true, // 是否选中
      //   "toCode": "",
      //   "type": 0
      // }
      // #endregion
    };
  },
  mounted() {
    this.getPermission();
  },
  computed: {
    title() {
      let temTitle = "";
      if (this.permissionInfo.level == 4) {
        // 功能相关
        if (this.scene) {
          // 添加
          temTitle = "添加功能";
        } else {
          //   修改
          temTitle = "修改功能";
        }
      } else {
        // 菜单相关
        if (this.scene) {
          // 添加
          temTitle =
            this.permissionInfo.level == 2 ? "添加一级菜单" : "添加二级菜单";
        } else {
          //修改
          temTitle = "修改菜单";
        }
      }
      return temTitle;
    },
  },
  methods: {
    // 获取菜单列表
    async getPermission() {
      this.loading = true;
      let result = await this.$API.acl.permission.getPermission();
      if (result.code == 20000) {
        this.tableData = result.data.children;
        this.expandRowKeys.push(result.data.children[0].id); //默认展开level1的根节点
        this.loading = false;
      } else {
        this.$message.error("获取菜单失败");
        this.loading = false;
      }
    },
    // 删除permission
    async removePermission(row) {
      let result = await this.$API.acl.permission.removePermission(row.id);
      if (result.code == 20000) {
        //    删除成功
        this.$message({ message: "删除成功", type: "success" });
        this.getPermission();
      } else {
        this.$message.error("获取菜单失败");
      }
    },
    // 点击新增按钮触发的回调
    addPermission(row) {
      this.dialogFormVisible = true;
      this.scene = true;
      this.permissionInfo.pid = row.id;
      this.permissionInfo.level = row.level + 1;
      this.pName = row.name;
      if (this.permissionInfo.level == 4) this.permissionInfo.type = 2;
    },
    // 点击修改按钮触发的回调
    updatePermission(row) {
      this.dialogFormVisible = true;
      this.scene = false;
      this.permissionInfo = { ...row };
    },
    // dialog关闭后执行的回调
    closeDialog() {
      // 重置permission
      this.permissionInfo = { ...this.$options.data().permissionInfo };
      if (!this.closeFlag)
        this.$message({
          message: this.scene ? "取消保存" : "取消修改",
          type: "warning",
        });
      // 抹去校验结果
      this.$refs.ruleForm.clearValidate();
    },
    // 点击保存触发的函数
    addOrUpdatePermission() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // 校验成功
          let result = await this.$API.acl.permission.addOrUpdatePermission(
            this.permissionInfo
          );
          if (result.code == 20000) {
            // 新增或者修改成功
            this.closeFlag = 1;
            this.dialogFormVisible = false;
            this.$message({
              message: this.scene ? "新增成功" : "修改成功",
              type: "success",
            });
            this.getPermission();
          } else {
            this.$message.error(this.scene ? "新增失败" : "修改失败");
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.permission {
  margin: 30px;
}
</style>