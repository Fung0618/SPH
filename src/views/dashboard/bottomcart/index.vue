<template>
  <div class="bottom_container">
      <!-- 这里是dashboard的底部容器 -->
      <el-row :gutter="10">
        <el-col :span="12">
            <LeftCard></LeftCard>
        </el-col>
        <el-col :span="12">
            <RightCard></RightCard>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import LeftCard from './leftcart'
import RightCard from './rightcart'
export default {
    components: {
      LeftCard,
      RightCard
    }
}
</script>

<style scoped>
  .bottom_container{
    margin-top: 15px
  }
</style>