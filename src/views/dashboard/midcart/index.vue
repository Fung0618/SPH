<template>
  <el-card class="midContainer">
    <div class="mid_header">
      <el-tabs v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <div class="date">
        <div class="block">
          <span class="demonstration" @click="thisDay">今日</span>
          <span class="demonstration" @click="thisWeek">本周</span>
          <span class="demonstration" @click="thisMonth">本月</span>
          <span class="demonstration" @click="thisYear">本年</span>
          <el-date-picker
            v-model="value"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="mid_bottom">
      <BarChartandList :activeName="activeName"></BarChartandList>
    </div>
  </el-card>
</template>

<script>
import dayjs from "dayjs";
import BarChartandList from "./barChartandList";
export default {
  data() {
    return {
      activeName: "sale",
      value: [],
    };
  },
  components: {
    BarChartandList,
  },
  methods: {
    //
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 点击今日时候的回调，需要在日期框中显示今日的日期
    thisDay() {
      // 采用dayjs来获取日期
      this.$set(this.value, 0, dayjs().format());
      this.$set(this.value, 1, dayjs().format());
    },
    // 点击本周时候的回调，需要在日期框中显示今日的日期
    thisWeek() {
      this.$set(this.value, 0, dayjs().startOf("week").add(1, "day").format());
      this.$set(this.value, 1, dayjs().endOf("week").add(1, "day").format());
    },
    // 点击本月时候的回调，需要在日期框中显示今日的日期
    thisMonth() {
      this.$set(this.value, 0, dayjs().startOf("month").format());
      this.$set(this.value, 1, dayjs().endOf("month").format());
    },
    // 点击本年时候的回调，需要在日期框中显示今日的日期
    thisYear() {
      this.$set(this.value, 0, dayjs().startOf("year").format());
      this.$set(this.value, 1, dayjs().endOf("year").format());
    },
  },
};
</script>

<style scpoed>
.mid_header {
  position: relative;
  padding: 0px 20px;
}

.mid_header .date {
  position: absolute;
  right: 20px;
  top: 0px;
}

.mid_header .date span {
  margin-right: 30px;
  cursor: pointer;
}

.el-tabs__item {
  font-size: 16px;
}

.midContainer .el-card__body{
  padding: 20px 0px
}

</style>