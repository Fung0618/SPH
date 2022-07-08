<template>
  <div>
    <!-- 这里用来写三级分类,并注册为全局组件 -->
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select
            placeholder="请选择"
            v-model="category1Id"
            @change="getCategory2List"
            :disabled="isDisable"
          >
            <el-option
              v-for="category1 in category1List"
              :key="category1.id"
              :label="category1.name"
              :value="category1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            placeholder="请选择"
            v-model="category2Id"
            @change="getCategory3List"
            :disabled="isDisable"
          >
            <el-option
              v-for="category2 in category2List"
              :key="category2.id"
              :label="category2.name"
              :value="category2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            placeholder="请选择"
            v-model="category3Id"
            @change="getList"
            :disabled="isDisable"
          >
            <el-option
              v-for="category3 in category3List"
              :key="category3.id"
              :label="category3.name"
              :value="category3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CategoryList",
  props: ["isDisable"],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      category1Id: "",
      category2Id: "",
      category3Id: "",
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类列表
    async getCategory1List() {
      let result = await this.$API.product.attr.getCategory1List();
      if (result.code == 200) {
        this.category1List = result.data;
      } else {
        this.$messasge.error("获取一级分类列表失败");
      }
    },
    // 获取二级分类列表
    async getCategory2List(category1Id) {
      // 先清空二级分类和三级分类的列表
      this.category2Id = "";
      this.category3Id = "";
      let result = await this.$API.product.attr.getCategory2List(category1Id);
      if (result.code == 200) {
        this.category2List = result.data;
      } else {
        this.$message.error("获取二级分类列表师表");
      }
    },
    // 获取三级分类列表
    async getCategory3List(category2Id) {
      // 先将三级分类清空
      this.category3Id = "";
      let result = await this.$API.product.attr.getCategory3List(category2Id);
      if (result.code == 200) {
        this.category3List = result.data;
      } else {
        this.$message.error("获取三级分类列表失败");
      }
    },
    // 触发获取属性/SPU列表
    getList() {
      const { category1Id, category2Id, category3Id } = this;
      this.$emit("getList", { category1Id, category2Id, category3Id });
    },
  },
};
</script>

<style>
</style>