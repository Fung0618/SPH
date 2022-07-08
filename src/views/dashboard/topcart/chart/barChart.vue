<template>
  <el-card>
    <div class="title">
      <span>支付笔数</span>
      <svg
        t="1654265514056"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5485"
        width="12"
        height="12"
      >
        <path
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          p-id="5486"
          fill="#bfbfbf"
        ></path>
        <path
          d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z"
          p-id="5487"
          fill="#bfbfbf"
        ></path>
        <path
          d="M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"
          p-id="5488"
          fill="#bfbfbf"
        ></path>
      </svg>
    </div>
    <div class="price">{{ homeData.payTotal }}</div>
    <div
      class="chart—container"
      ref="container"
      style="width: 100%; height: 70px"
    ></div>
    <div>
      <span>转换率{{ homeData.payRate }}%</span>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  data() {
    return {
      myChart: null,
    };
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.container);
    this.drawEchart()
  },
  computed: {
    ...mapState("home", ["homeData"]),
  },
  methods: {
    drawEchart() {
      this.myChart.setOption({
        tooltip: {},
        xAxis: {
          type: "category",
          data: [
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
          ],
          show: false,
        },
        yAxis: {
          // type: "category",
          show: false,
        },
        grid: {
          width: "auto",
          height: "-70%",
          show: false,
          left: "0",
          top: "70",
        },
        series: [
          {
            name: "支付笔数",
            type: "bar",
            data: this.homeData.payTrend,
            symbol: "none",
          },
        ],
        color: "skyblue",
      });
    },
  },
  watch:{
    homeData:{
      handler(newValue,oldValue){
        this.drawEchart()
      }
    }
  }
};
</script>

<style scoped>
span {
  font-size: 14px;
}

.title {
  display: flex;
  justify-content: space-between;
}
.title span {
  color: #ccc;
}
.price {
  padding: 0px;
  margin: 10px 0px 5px -5px;
  font-size: 25px;
}

.chart—container {
  /* height: 50px; */
  border-bottom: 1px solid #eeeeee;
}
</style>