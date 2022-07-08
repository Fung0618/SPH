<template>
  <el-card>
    <div class="title">
      <span>总销售额</span>
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
    <div class="price">￥{{ homeData.salesTotal }}</div>
    <div class="chart—container">
      <span>周同比{{ homeData.salesGrowthLastMonth }}%</span>
      <svg
        v-if="homeData.salesGrowthLastMonth < 0"
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
        v-else
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
      <span style="margin-left:8px">日同比{{ homeData.salesGrowthLastDay }}%</span>
      <svg
        v-if="homeData.salesGrowthLastDay < 0"
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
        v-else
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
    <div>
      <span>日销售量￥{{homeData.salesToday}}</span>
    </div>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("home", ["homeData"]),
  },
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
  height: 70px;
  border-bottom: 1px solid #eeeeee;
}
</style>