<template>
<!-- 该组件用来鼠标移入按钮可以显示对应的提示 -->
  <a :title="title" style="margin:10px">
      <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
    name: "Hintbutton",
    props:['title'],
}
</script>

