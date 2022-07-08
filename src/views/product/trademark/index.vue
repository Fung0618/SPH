<template>
  <div class="contain">
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click.native="addTrademark"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table
      :data="trademarkList"
      style="width: 100%; margin-top: 10px"
      border
    >
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row }">
          <Hintbutton
            title="修改品牌"
            type="warning"
            icon="el-icon-edit"
            @click.native="updateTrademark(row)"
          ></Hintbutton>
          <el-popconfirm
            @onConfirm="removeTrademark(row)"
            :title="`确定要删除${row.tmName}吗？`"
            @onCancel="$message('取消删除')">
            <Hintbutton
              title="删除品牌"
              type="danger"
              icon="el-icon-delete"
              slot="reference"
            ></Hintbutton>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table> 
    <!-- 分页器 -->
    <!-- @size-change="handleSizeChange 页码连续显示数发生改变时触发的事件"
        @current-change="handleCurrentChange" 当前页面发生改变时触发的事件 -->
    <el-pagination
      background
      style="text-align: center; margin-top: 10px"
      :current-page="pageNo"
      :page-sizes="[3, 5, 7, 9]"
      :page-size="pageSize"
      layout=" prev, pager, next, jumper, ->, sizes, total "
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 弹框 -->
    <!-- :before-close="handleClose" 关闭弹框前的回调 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="60%"
      @close="cancelDialog"
      :close-on-click-modal="false"
    >
      <!-- 弹框内的表格 -->
      <el-form
        status-icon
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        :model="trademarkInfo"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input
            type="text"
            autocomplete="off"
            v-model="trademarkInfo.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- 上传框 -->
          <!-- :on-success="handleAvatarSuccess" 点击上传成功后的触发的回调
            :before-upload="beforeAvatarUpload"
             action="/admin/product/upload" 这里要写真正要将图片上传的接口
             -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkInfo.logoUrl"
              :src="trademarkInfo.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 品牌列表
      trademarkList: [],
      // 当前页码(默认是第一页)
      pageNo: 1,
      // 每页展示数(默认是3)
      pageSize: 3,
      // 总个数
      total: 0,
      // 控制弹框显示的参数
      dialogVisible: false,
      // 更新或者添加品牌的请求体对象(新增不需要id)
      trademarkInfo: {
        logoUrl: "",
        tmName: "",
      },
      title: "",
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 10, message: "品牌名称在2~10位", trigger: "blur" },
        ],
        logoUrl: [
          { required: true, message: "请选择品牌图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    // 组件一挂载就获取列表
    this.getData();
  },
  methods: {
    // 获取品牌列表
    async getData(pageNo = 1, pageSize = 3) {
      let result = await this.$API.product.trademark.getTrademarkList(pageNo, pageSize);
      if (result.code == 200) {
        //  获取品牌列表成功
        this.trademarkList = result.data.records;
        this.pageNo = result.data.current;
        this.pageSize = result.data.size;
        this.total = result.data.total;
      } else {
        return Promise.reject(new Error("faile"));
      }
    },
    //  页码发生改变
    handleCurrentChange(pageNo) {
      this.getData(pageNo, this.pageSize);
    },
    //  每页显示数发生改变
    handleSizeChange(pageSize) {
      this.getData(this.pageNo, pageSize);
    },
    //  上传成功后的回调
    handleAvatarSuccess(res, file) {
      console.log(res)
      if (res.code == 200) {
        // res的data就是上传成功后返回的图片地址
        this.trademarkInfo.logoUrl = res.data;
      } else {
        this.$message.error("上传失败");
      }
    },
    // 上传前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或者PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 点击取消获取关闭按钮关闭弹框
    cancelDialog() {
      // 让弹框消失
      this.dialogVisible = false;
      // 让与表单绑定的请求体对象重置
      this.trademarkInfo = { ...this.$options.data().trademarkInfo };
      // 消除所有的表单验证失败信息
      this.$refs.ruleForm.resetFields();
    },
    // 点击修改按钮触发的事件
    async updateTrademark(row) {
      // 根据id发请求获取回显数据
      this.dialogVisible = true;
      this.title = "修改品牌";
      let result = await this.$API.product.trademark.getTrademarkById(row.id);
      if (result.code == 200) {
        this.trademarkInfo = result.data;
      } else {
        this.$message.error("faile");
        this.dialogVisible = false;
      }
    },
    //  点击添加按钮触发的事件
    addTrademark() {
      this.dialogVisible = true;
      this.title = "添加品牌";
    },
    //  点击确认按钮触发的事件
    addOrUpdateTrademark() {
      // 表单验证
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // 验证全部成功
          // 发送请求
          let result = await this.$API.product.trademark.addOrUpdateTrademark(
            this.trademarkInfo
          );
          if (result.code == 200) {
            // 新增或者修改品牌成功
            this.getData(
              this.trademarkInfo.id ? this.pageNo : 1,
              this.pageSize
            ); //获取新的列表
            this.$message({
              message: this.trademarkInfo.id ? "修改成功" : "添加成功",
              type: "success",
            }); //成功泡泡
            this.dialogVisible = false; //关闭弹框
          }
        } else {
          //  验证失败
          this.$message.error(this.trademarkInfo.id ? "修改失败" : "添加失败");
        }
      });
    },
    //  删除品牌
    async removeTrademark(row) {
      let result = await this.$API.product.trademark.removeTrademark(row.id);
      console.log(result);
      if (result.code == 200) {
        //  删除成功
        this.$message({ message: "删除成功", type: "success" });
        this.getData(
          this.trademarkList.length <= 1 ? this.pageNo - 1 : this.pageNo,
          this.pageSize
        );
      } else {
        this.$message.error("删除失败");
      }
    },
  },
};
</script>

<style scoped>
.contain {
  padding: 20px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
