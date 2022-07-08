<template>
  <div>
    <!-- 三级分类 -->
    <CategoryList @getList="getList" :isDisable="!scene == 0"></CategoryList>
    <el-card class="box-card">
      <!-- Spu列表页 -->
      <div v-if="scene == 0">
        <!-- 按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!categoryIds.category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <!-- 列表表格 -->
        <el-table :data="spuList" style="width: 100%; margin-top: 15px" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <Hintbutton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></Hintbutton>
              <Hintbutton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></Hintbutton>
              <Hintbutton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu的所有sku列表"
                @click="showSkuList(row)"
              ></Hintbutton>
              <el-popconfirm
                :title="`确定要删除${row.spuName}吗?`"
                @onConfirm="removeSpu(row)"
              >
                <Hintbutton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>

      <!-- sku弹框 -->
      <el-dialog
        :title="`${currentSpu.spuName}的sku列表`"
        :visible.sync="dialogTableVisible"
        width="60%"
        @close="skuList = []"
      >
        <el-table :data="skuList" v-loading="loading" border>
          <el-table-column
            prop="skuName"
            label="名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="weight"
            label="重量"
            width="width"
          ></el-table-column>
          <el-table-column label="默认图片" width="width">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- 添加与修改Spu -->
      <Spuform
        :category3Id="categoryIds.category3Id"
        @changeScene="changeScene"
        v-if="scene == 1"
      ></Spuform>
      <!-- 添加sku -->
      <Skuform
        :spu="currentSpu"
        :category3Id="categoryIds.category3Id"
        @changeScene="changeScene"
        v-if="scene == 2"
      ></Skuform>
    </el-card>
  </div>
</template>

<script>
import Spuform from "./spuform";
import Skuform from "./skuform";
export default {
  data() {
    return {
      isShow: true,
      pageNo: 1,
      pageSize: 3,
      total: 0,
      // 保存一级二级三级列表分类
      categoryIds: {},
      // 保存Spu列表
      spuList: [],
      // 用来
      skuList: [],
      // 控制spu列表、新增与修改spu、新增sku三层切换的变量
      // 0->spu列表  1->新增与修改spu  2-> 新增sku
      scene: 0,
      // 控制弹框的显示
      dialogTableVisible: false,
      // 表格获取时的loading效果
      loading: false,
      // 当前聚焦的spu
      currentSpu: "",
    };
  },
  components: {
    Spuform,
    Skuform,
  },
  methods: {
    // 真正发请求获取数据的方法
    async getData() {
      // 发请求获取Spu列表
      let result = await this.$API.product.spu.getSpuList(
        this.pageNo,
        this.pageSize,
        this.categoryIds.category3Id
      );
      if (result.code == 200) {
        this.spuList = result.data.records;
        this.pageNo = result.data.current;
        this.pageSize = result.data.size;
        this.total = result.data.total;
      } else {
        this.$message.error("获取列表失败");
      }
    },
    // 三级分类组件当完成勾选完全部分类时触发的事件
    // 会把一级二级三级选中的分类id注入
    async getList({ category1Id, category2Id, category3Id }) {
      // 将一级二级三级分类中保存起来
      this.categoryIds = { category1Id, category2Id, category3Id };
      // 获取spu列表
      this.getData();
    },
    //  每页显示数发生改变触发的事件
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getData();
    },
    //  当前页发生改变触发的事件
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo;
      this.getData();
    },
    //  删除Spu
    async removeSpu(row) {
      let result = await this.$API.product.spu.removeSpu(row.id);
      if (result.code == 200) {
        //  删除成功
        this.$message({ message: "删除成功", type: "success" });
        // 如果是删除当页（非第一页）的最后一个，删除后跳到上一页
        if (this.spuList.length == 1 && this.pageNo > 1) {
          this.pageNo = this.pageNo - 1;
        }
        this.getData();
      } else {
        //   删除失败
        this.$message.error("删除失败");
      }
    },
    // 展示当前spu的sku列表
    async showSkuList(row) {
      //  先显示弹框
      this.dialogTableVisible = true;
      // 开启加载
      this.loading = true;
      this.title = row.spuName;
      let result = await this.$API.product.spu.getSkuListBySpuId(row.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false; //关闭加载
      } else {
        this.$message.error("获取sku列表失败");
      }
    },
    // 子组件点击取消后触发的回调
    changeScene(flag) {
      //  后面再补充逻辑
      this.scene = flag;
      //  重新获取一遍列表
      this.getData();
    },
    // 添加sku
    async addSku(row) {
      // 1. 触发子组件发三个请求
      // 1）获取当前spu的所有图片
      // 2）获取当前spu的所有销售属性
      // 3）获取当前三级分类下的所有平台属性
      this.scene = 2; //显示skuform
      this.currentSpu = row; //将当前点击的row赋值给currentSpu
      // 这里就委派vuex进行发请求就好,不适合用事件全局总线
      let p1 = this.$store.dispatch("spu/getSpuImgs", row);
      let p2 = this.$store.dispatch("spu/getSpuSaleAttrList", row);
      let p3 = this.$store.dispatch("spu/getAttrList", this.categoryIds);
      const arr = [p1, p2, p3];
      try {
        await Promise.all(arr);
      } catch (error) {
        this.$message.error(error.message);
        this.scene = 0;
      }
    },
    // 添加spu
    async addSpu() {
      // 1.委派获取平台的所有销售属性
      // 2.委派获取平台的所有品牌
      this.scene = 1;
      let p1 = this.$store.dispatch("spu/getTrademarkList");
      let p2 = this.$store.dispatch("spu/getBaseSaleAttrList");
      try {
        await Promise.all([p1, p2]);
      } catch (error) {
        // 获取失败回到列表页
        this.$message.error(error.messaage);
        this.scene = 0;
      }
    },
    // 修改spu
    async updateSpu(row) {
      // 1.委派获取当前的spu信息
      // 2.委派获取平台的所有销售属性
      // 3.委派获取平台的所有品牌
      // 4.委派获取当前spu的图片列表
      this.scene = 1;
      let p1 = this.$store.dispatch("spu/getSpuInfoBySpuId", row.id);
      let p2 = this.$store.dispatch("spu/getTrademarkList");
      let p3 = this.$store.dispatch("spu/getBaseSaleAttrList");
      let p4 = this.$store.dispatch("spu/getSpuImgs", row);
      try {
        await Promise.all([p1, p2, p3, p4]);
      } catch (error) {
        // 获取失败回到列表页
        this.$message.error(error.messaage);
        this.scene = 0;
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