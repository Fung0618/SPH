<template>
  <el-card>
    <div class="header">
      <div class="title">线上热门搜索</div>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link el-icon-more"> </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>华为P50</el-dropdown-item>
          <el-dropdown-item>小米12pro</el-dropdown-item>
          <el-dropdown-item>三星S22</el-dropdown-item>
          <el-dropdown-item>iphone13pro</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="chart">
      <el-row :gutter="10">
        <el-col :span="12">
          <Chart></Chart>
        </el-col>
        <el-col :span="12">
          <Chart></Chart>
        </el-col>
      </el-row>
    </div>

    <div class="table">
      <el-table :data="tabelData" style="width: 100%" border>
        <el-table-column type="index" label="排名" width="80px">
        </el-table-column>
        <el-table-column prop="prop" label="搜搜关键字" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="用户数" width="width" sortable>
        </el-table-column>
        <el-table-column prop="prop" label="周涨幅" width="width" sortable>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        style="text-align:right"
        :current-page="1"
        :page-sizes="[3, 5, 7]"
        :page-size="3"
        layout=" prev, pager, next"
        :total="31">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import Chart from "./chart";
export default {
  data(){
    return {
      tabelData: [{}]
    }
  },
  components: {
    Chart,
  },
};
</script>

<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin: 0px 20px 20px 20px;
}

.el-dropdown-link {
  color: #333;
}

.chart {
  padding: 30px 20px;
  border-top: 1px solid #eee;
}

.table{
  padding: 0px 20px;
}

</style>