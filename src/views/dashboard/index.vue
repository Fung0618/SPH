<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <TopCart></TopCart>
    <MidCart></MidCart>
    <BottomCart></BottomCart>
  </div>
</template>

<script>
import BottomCart from './bottomcart'
import MidCart from './midcart'
import TopCart from './topcart'
export default {
  name: 'Dashboard',
  mounted(){
    this.getHomeData()
  },
  computed: {},
  components:{
    BottomCart,
    MidCart,
    TopCart
  },
  methods:{
    // TODO: 这里的委派可以放在路由守卫中同步获取数据,避免等首页加载完,图表中没有数据(可以省去在每个图表组件中
    // 进行数据监视才开始绘制图表)
   async getHomeData(){
    try {
      // await的作用就是将获取数据变为同步
       await this.$store.dispatch('home/getHomeData')
    } catch (error) {
      this.$message.error(error.message)
    }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 20px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
