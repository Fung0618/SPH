<template>
  <el-card>
    <div class="header">
      <div class="title">销售额类别占比</div>
      <el-radio-group
        size="mini"
        v-model="tabPosition"
        style="margin-bottom: 30px"
      >
        <el-radio-button label="online">线上</el-radio-button>
        <el-radio-button label="shop">门店</el-radio-button>
      </el-radio-group>
    </div>

    <div class="chart">
      <div
        class="chart_container"
        ref="container"
        style="width: 100%; height: 300px"
      ></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  data() {
    return {
      tabPosition: "online",
      myChart: null,
      onlineData: [],
      shopData: [],
    };
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.container);
    this.drawEchart();
  },
  computed: {
    ...mapState("home", ["homeData"]),
  },
  methods: {
    drawEchart() {
      this.myChart.setOption({
        title: {
          text: "",
          subtext: "",
          left: "center",
          top: "center",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "各类商品的销售额占比",
            type: "pie",
            radius: "50%",
            radius: ["45%", "75%"],
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 2,
            },
            data:
              this.tabPosition == "online" ? this.onlineData : this.shopData,
          },
        ],
      });

      this.myChart.on("mouseover", (params) => {
        // 重新设置，新的值会覆盖久值
        this.myChart.setOption({
          title: {
            text: params.name,
            subtext: params.value,
          },
        });
      });
    },
  },
  watch: {
    tabPosition: {
      handler(newValue, oldValue) {
        this.drawEchart()
      },
    },
    homeData: {
      handler(newValue, oldValue) {
        this.onlineData = newValue.saleRank.online.name.map((item, index) => {
          return {
            value: newValue.saleRank.online.value[index],
            name: item,
          };
        });
        this.shopData = newValue.saleRank.shop.name.map((item, index) => {
          return {
            value: newValue.saleRank.shop.value[index],
            name: item,
          };
        });
        this.drawEchart();
      },
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin: 0px 20px 20px 20px;
}
</style>