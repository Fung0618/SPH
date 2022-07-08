<template>
  <div>
    <div class="top">
      <span>搜索用户数</span>
      <svg
        t="1654416700904"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2423"
        width="18"
        height="18"
      >
        <path
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          p-id="2424"
          fill="#8a8a8a"
        ></path>
        <path
          d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z"
          p-id="2425"
          fill="#8a8a8a"
        ></path>
        <path
          d="M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"
          p-id="2426"
          fill="#8a8a8a"
        ></path>
      </svg>
    </div>
    <div class="mid">
      <span style="margin-right: 20px">12321</span>
      <span style="margin-right: 10px">17.1</span>
      <svg
        t="1654265960334"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="6551"
        width="16"
        height="16"
      >
        <path
          d="M257.216 600.832l253.76 279.168 253.76-279.168c21.856-24.064 13.312-43.52-19.04-43.52h-117.408V234.752c0-32.544-26.24-58.752-58.624-58.752h-117.44A58.56 58.56 0 0 0 393.6 234.752v322.592H276.288c-32.288 0-40.896 19.456-19.072 43.488z"
          p-id="6552"
          fill="#1afa29"
        ></path>
      </svg>
      <svg
        t="1654266014707"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="8289"
        width="12"
        height="12"
      >
        <path
          d="M698.7 480.9v429.5c0 54.8-44.5 99.3-99.3 99.3H434c-54.8 0-99.3-44.5-99.3-99.3V480.9H70l446.9-463 446.9 463H698.7z m0 0"
          fill="#d81e06"
          p-id="8290"
        ></path>
      </svg>
    </div>
    <div
      class="chart—container"
      ref="container"
      style="width: 100%; height: 70px"
    ></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  mounted() {
    var myChart = echarts.init(this.$refs.container);
    myChart.setOption({
      tooltip: {},
      xAxis: {
        type: "category",
        data: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月",
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
          name: "销量",
          type: "line",
          data: [10, 5, 36, 10, 80, 20, 35, 20, 10, 25, 33, 21],
          symbol: "none",
          lineStyle: {
            width: 2,
            color: "rgba(48, 118, 215, 1)",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(48, 118, 215, 1)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            shadowBlur: 20,
            shadowColor: "rgba(191, 133, 220, 1)",
            opacity: 0.4,
            origin: "0",
          },
        },
      ],
    });
  },
};
</script>

<style scoped>
span {
  font-size: 16px;
  margin-right: 20px;
}

svg {
  vertical-align: middle;
  margin-top: -2px;
}

.mid {
  margin: 10px 0px;
}
</style>