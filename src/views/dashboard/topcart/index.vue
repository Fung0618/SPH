<template>
  <div class="topContainer">
    <!-- 这里是dashboard的顶部容器 -->
    <el-row :gutter="10">
      <!-- 这里是一行4个cart的容器 -->
      <el-col :span="6">
        <NormalChart></NormalChart>
      </el-col>
      <el-col :span="6">
        <LineChart></LineChart>
      </el-col>
      <el-col :span="6">
        <BarChart></BarChart>
      </el-col>
      <el-col :span="6">
        <SingleChart></SingleChart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import NormalChart from "./chart/normalChart.vue";
import LineChart from "./chart/lineChart.vue";
import BarChart from "./chart/barChart.vue";
import SingleChart from "./chart/singleChart.vue";
export default {
  components: {
    NormalChart,
    LineChart,
    BarChart,
    SingleChart,
  },
};
</script>

<style scoped>
    .topContainer{
      margin-bottom: 10px;
    }
</style>  