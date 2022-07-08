<template>
  <el-row :gutter="10">
    <el-col :span="18">
      <div
        class="container"
        ref="container"
        style="width: 100%; height: 300px"
      ></div>
    </el-col>
    <el-col :span="6">
      <h3>门店{{ activeName === "sale" ? "销售额" : "访问量" }}排名</h3>
      <ul>
        <li v-for="item in rankList" :key="item.no">
          <span :class="{ rank: item.no <= 3 }">{{ item.no }}</span>
          <span class="name">{{ item.name }}</span>
          <span class="num">{{ item.money }}</span>
        </li>
      </ul>
    </el-col>
  </el-row>
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
  props: ["activeName"],
  mounted() {
    // myChart在挂载的时候赋值一次即可
    this.myChart = echarts.init(this.$refs.container);
    this.drawEchart();
  },
  computed: {
    ...mapState("home", ["homeData"]),
    rankList() {
      return this.activeName === "sale"
        ? this.homeData.orderRank
        : this.homeData.userRank;
    },
  },
  methods: {
    drawEchart() {
      this.myChart.setOption({
        title: {
          text: "销售额",
          top: "15px",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowBlur: 5,
            },
            label: {
              show: true,
            },
          },
        },
        xAxis: {
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
        grid: {
          left: "60px",
          top: "70px",
          bottom: "20px",
          right: "60px",
        },
        yAxis: {
          show: true,
          axisLine: {
            show: true,
          },
          axisTick: {
            show: true,
          },
        },
        series: [
          {
            name: "额度",
            type: "bar",
            data: this.homeData.orderFullYear,
            barWidth: "60%",
          },
        ],
        color: "rgba(55, 213, 155, 1)",
      });
    },
  },
  watch: {
    activeName: {
      handler(newValue, oldValue) {
        console.log(111);
        if (newValue == "sale") {
          // 销售额
          this.drawEchart();
          this.myChart.setOption({
            title: {
              text: "销售额",
            },
            xAxis: {
              data: this.homeData.orderFullYearAxis,
            },
            series: [
              {
                name: "额度",
                data: this.homeData.orderFullYear,
              },
            ],
          });
        } else {
          // 访问量
          this.drawEchart();
          this.myChart.setOption({
            title: {
              text: "访问量",
            },
            xAxis: {
              data: this.homeData.userFullYearAxis,
            },
            series: [
              {
                name: "数量",
                data: this.homeData.userFullYear,
              },
            ],
          });
        }
      },
    },
    homeData: {
      handler(newValue, oldValue) {
        this.drawEchart();
      },
    },
  },
};
</script>

<style scoped>
.el-row {
  /* background-color: #bfa; */
  border-top: 1px solid #eee;
  margin-top: 20px;
}

.el-row .container {
  /* background-color: skyblue; */
}

ul {
  padding: 0px 30px 0px 0px;
}

li {
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin: 15px 0px;
}

li span {
  font-size: 17px;
}

li span:nth-child(1) {
  width: 20px;
  text-align: center;
}

li .rank {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: white;
  line-height: 20px;
  text-align: center;
}

li .name {
  width: 40%;
  text-align: center;
}

li .num {
  width: 50%;
  text-align: right;
}
</style>