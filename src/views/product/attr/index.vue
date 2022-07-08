<template>
  <div>
    <!-- 三级分类 -->
    <CategoryList
      @getList="getList"
      :isDisable="!isShow"
    ></CategoryList>
    <!-- 属性列表 -->
    <el-card v-if="isShow" class="box-card">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 10px"
        @click="isShow = false"
        :disabled="!categoryIds.category3Id"
        >添加属性</el-button
      >
      <el-table :data="attrList" style="width: 100%" border>
        <el-table-column type="index" align="center" label="序号" width="80px">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="120px">
        </el-table-column>
        <el-table-column prop="prop" label="属性值列表" width="width">
          <template slot-scope="{ row, $index }">
            <el-tag
              v-for="attr in row.attrValueList"
              :key="attr.id"
              type="success"
              style="margin: 0px 10px"
              >{{ attr.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="200px">
          <template slot-scope="{ row, $index }">
            <Hintbutton
              title="修改平台属性"
              icon="el-icon-edit"
              type="warning"
              size="mini"
              @click="updateAttr(row)"
            ></Hintbutton>
            <el-popconfirm
              :title="`确定要删除${row.attrName}吗？`"
              @onConfirm="removeAttr(row)"
            >
              <Hintbutton
                title="删除平台属性"
                icon="el-icon-delete"
                type="danger"
                size="mini"
                slot="reference"
              ></Hintbutton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加与修改属性面板 -->
    <el-card v-else class="box-card">
      <!-- 添加属性的input -->
      <el-form ref="form" label-width="80px">
        <el-form-item label="属性名">
          <el-input
            placeholder="请输入属性名"
            style="width: 15%"
            v-model="attrInfo.attrName"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attrInfo.attrName"
        @click="addAttrValue"
        >添加属性值</el-button
      >
      <el-button @click="cancelSave">取消</el-button>
      <!-- 显示属性列表 -->
      <el-table :data="attrInfo.attrValueList" style="margin: 20px 0px" border>
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <!-- 第二列用来占位， 不知道为啥只有第二列不能使用插槽-->
        <el-table-column label="操作" width="0px"> </el-table-column>
        <el-table-column label="属性值名称" width="width">
          <template slot-scope="{ row, $index }">
            <el-input
              v-model="row.valueName"
              v-show="row.flag"
              @blur="blurEvent(row)"
              size="mini"
              :ref="$index"
              placeholder="请输入属性值名称"
            ></el-input>
            <span
              v-show="!row.flag"
              style="display: block"
              @click="spanClick(row, $index)"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-popconfirm
              :title="`确定要删除${row.valueName}吗？`"
              @onConfirm="deleteAttrValue(row, $index)"
            >
              <Hintbutton
                title="删除属性值"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></Hintbutton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        :disabled="!attrInfo.attrValueList.length"
        @click="saveAttr"
        >保存</el-button
      >
      <el-button @click="cancelSave">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      isShow: true,
      attrList: [],
      // 保存一级二级三级列表分类
      categoryIds: {},
      // 保存与修改的请求体
      attrInfo: {
        attrName: "",
        categoryId: "",
        categoryLevel: 3,
        attrValueList: [],
      },
      // 思考一下是否需要要多一个对象来接受修改属性的回显对象
    };
  },
  methods: {
    // 三级分类组件当完成勾选完全部分类时触发的事件
    // 会把一级二级三级选中的分类id注入
    async getList({ category1Id, category2Id, category3Id }) {
      // 将一级二级三级分类中保存起来
      this.categoryIds = { category1Id, category2Id, category3Id };
      // 将三级分类的id保存在请求体对象中
      this.attrInfo.categoryId = category3Id;
      let result = await this.$API.product.attr.getAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      } else {
        this.$message.error("获取平台属性列表失败");
      }
    },
    // 删除平台属性
    async removeAttr(row) {
      let result = await this.$API.product.attr.removeAttr(row.id);
      if (result.code == 200) {
        // 删除成功
        this.$message({ message: "删除成功", type: "success" });
        //  重新获取列表
        this.getList(this.categoryIds);
      } else {
        this.$message.error("删除失败");
      }
    },
    // 给平台属性添加一个值
    addAttrValue() {
      // 给valueList数组添加一个对象
      this.attrInfo.attrValueList.push({ valueName: "", flag: true });
      // 跟模板渲染完后就给input聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 属性值的input框blur时触发的函数
    blurEvent(row) {
      if (row.valueName) {
        // 填了值
        row.flag = false;
      } else {
        // 没填值
        this.$message({ message: "请填写属性值", type: "warning" });
      }
    },
    // span的点击事件
    spanClick(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 点击取消按钮，需要将attrInfo重置
    cancelSave() {
      // 关闭弹框
      this.isShow = true;
      // 重置attrInfo
      this._data.attrInfo = { ...this.$options.data().attrInfo };
    },
    // 点击修改按钮触发的事件
    updateAttr(row) {
      // 显示弹框表格
      this.isShow = false;
      // this.attrInfo = { ...row }; //这是浅拷贝
      // 将行数据深拷贝到请求体对象中
      const temInfo = _.cloneDeep(row); //但是此时的attrInfod的attrValueList没有flag字段，无法控制input和span的切换
      temInfo.attrValueList.forEach(item=>{ //给中转变量赋值设置flag字段
        item.flag = false
      })
      this.attrInfo = temInfo   //最后赋值flag就会变成响应式字段
    },
    // 点击删除属性值按钮并确认触发的事件
    deleteAttrValue(row, index) {
      // 移除属性值
      this.attrInfo.attrValueList.splice(index, 1);
      this.$message({ message: "删除成功", type: "success" });
    },
    // 保存平台属性
   async saveAttr() {
      // 1.整理请求体参数 如果当前attrInfo携带id就是修改，不携带id就是新增
      this.attrInfo.attrValueList.forEach((item) => {
        if (this.attrInfo.id) {
          //修改
          delete item.flag; // 删除flag字段
          item.attrId = this.attrInfo.id; //将该属性值赋上所属属性的id
        } else {
          //新增
          delete item.flag; // 删除flag字段
        }
      });
      // 2.发请求保存
    let result = await this.$API.product.attr.addOrUpdateAttr(this.attrInfo)
    if(result.code == 200){
      this.$message({message:this.attrInfo.id?'修改成功':'添加成功',type:'success'})
      this.cancelSave() //关闭保存框并且重置attrInfo
      this.getList(this.categoryIds) //获取最新的平台属性列表
    }else{
      this.$message.error(this.attrInfo.id?'修改失败':'添加失败')
      this.cancelSave()
    }
    },
  },
};
</script>

<style>
.box-card {
  margin: 15px;
}
</style>