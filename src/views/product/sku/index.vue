<template>
  <div style="margin: 20px">
    <el-table :data="skuList" style="width: 100%; margin-bottom: 20px" border>
      <el-table-column align="center" type="index" label="序号" width="80px">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="120px">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="100px">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100px">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <Hintbutton
            @click="cancelSale(row)"
            v-if="row.isSale == 1"
            title="商品下架"
            type="success"
            size="mini"
            icon="el-icon-top"
          ></Hintbutton>
          <Hintbutton
            @click="onSale(row)"
            v-else
            title="商品上架"
            type="success"
            size="mini"
            icon="el-icon-bottom"
          ></Hintbutton>
          <Hintbutton
            @click="$message({ message: '正在开发中,敬请期待', type: 'info' })"
            title="修改sku"
            type="primary"
            size="mini"
            icon="el-icon-edit"
          ></Hintbutton>
          <Hintbutton
            @click="skuInfoDetail(row)"
            title="查看sku详细信息"
            type="info"
            size="mini"
            icon="el-icon-info"
          ></Hintbutton>
          <el-popconfirm @onConfirm	="removeSku(row)" :title="`确定要删除${row.skuName}吗？`">
            <Hintbutton
              title="删除sku"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              slot="reference"
            ></Hintbutton>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉 -->
    <el-drawer size="50%" :visible.sync="drawer" :with-header="false">
      <div style="padding: 40px 0px">
        <el-row :gutter="15">
          <el-col :span="6" style="text-align: right"><span>名称</span></el-col>
          <el-col :span="18"
            ><span>{{ skuInfo.skuName }}</span></el-col
          >
        </el-row>
        <el-row :gutter="15">
          <el-col :span="6" style="text-align: right"><span>描述</span></el-col>
          <el-col :span="18"
            ><span>{{ skuInfo.skuDesc }}</span></el-col
          >
        </el-row>
        <el-row :gutter="15">
          <el-col :span="6" style="text-align: right"><span>价格</span></el-col>
          <el-col :span="18"
            ><span>{{ skuInfo.price }}元</span></el-col
          >
        </el-row>
        <el-row :gutter="15">
          <el-col :span="6" style="text-align: right"
            ><span>平台属性</span></el-col
          >
          <el-col :span="18">
            <el-tag
              style="margin-left: 10px"
              v-for="skuSaleAttrValue in skuInfo.skuSaleAttrValueList"
              :key="skuSaleAttrValue.id"
              type="success"
              >{{ skuSaleAttrValue.saleAttrValueName }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="6" style="text-align: right"
            ><span>商品图片</span></el-col
          >
          <el-col :span="18">
            <div class="block">
              <el-carousel
                trigger="click"
                height="500px"
                style="width: 85%; border: 1px solid #ccc"
              >
                <el-carousel-item
                  v-for="img in skuInfo.skuImageList"
                  :key="img.id"
                >
                  <img :src="img.imgUrl" style="width: 100%; height: 100%" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      style="text-align: center"
      :current-page="pageNo"
      :page-sizes="[3, 5, 7]"
      :page-size="pageSize"
      layout=" prev, pager, next, jumper, ->, sizes, total"
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
      // 每页显示数量
      pageSize: 7,
      // 总数量
      total: 10,
      // sku列表
      skuList: [],
      // 控制抽屉的显示与隐藏的变量
      drawer: false,
      // 抽屉中skuInfo
      skuInfo: {},
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    // 获取sku列表
    async getSkuList() {
      let result = await this.$API.product.sku.getSkuList(this.pageNo, this.pageSize);
      if (result.code == 200) {
        this.pageNo = result.data.current;
        this.pageSize = result.data.size;
        this.total = result.data.total;
        this.skuList = result.data.records;
        return "ok";
      } else {
        this.$$message.error("获取列表失败");
        return Promise.reject(new Error("faile"));
      }
    },
    // 每页显示数发生改变时触发的回调
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getSkuList();
    },
    // 当前页码发生改变时触发的回调
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo;
      this.getSkuList();
    },
    // 商品下架
    async cancelSale(row) {
      // 发请求
      let result = await this.$API.product.sku.cancelSale(row.id);
      if (result.code == 200) {
        this.$message({ message: "下架成功", type: "success" });
        this.getSkuList();
      } else {
        this.$message.error("下架失败");
      }
    },
    // 尚品上架
    async onSale(row) {
      // 发请求
      let result = await this.$API.product.sku.onSale(row.id);
      if (result.code == 200) {
        this.$message({ message: "上架成功", type: "success" });
        this.getSkuList();
      } else {
        this.$message.error("上架成功");
      }
    },
    // 查看sku的详细信息
    async skuInfoDetail(row) {
      this.drawer = true;
      // 发请求获取skuInfo
      let result = await this.$API.product.sku.getSkuInfoBySkuId(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      } else {
        this.$message.error("获取sku信息失败");
      }
    },
    // 删除sku
    async removeSku(row) {
      let result = await this.$API.product.sku.removeSkuBySkuId(row.id);
      if(result.code == 200){
        this.$message({message:'删除成功',type:'success'})
        this.getSkuList()
      }else{
        this.$message.error('删除失败')
      }
    },
  },
};
</script>

<style scoped>
>>> .el-row {
  margin: 20px 0px;
}
>>> .el-carousel__button {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  margin: 0px 8px;
}
</style>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>