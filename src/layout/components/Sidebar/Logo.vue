<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <!-- 当router-link显示与不显示的过程会发生动画 -->
    <transition name="sidebarLogoFade">
      <!-- logo折叠 因为collapse的初始值为false 所以不显示logo的折叠状态 -->
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo"> 
        <h1 v-else class="sidebar-title">{{ title }} </h1> <!--显示折叠logo的时候文字不显示-->
      </router-link>
      <!-- logo展开 因为collapse的初始值为false 所以默认显示logo的展开状态 -->
      <router-link v-else  key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '随便卖卖后台',
      logo: 'https://s3.bmp.ovh/imgs/2022/06/08/45547aa1c0bf3f08.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

// 对于用了v-if与v-else的元素，它们共用一个起终点样式以及共用一个过程样式
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;   

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    // logo图片
    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px; //与文字的右边距
    }

    // logo文字
    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
  // 这是折叠情况下logo图片的右边距为0(这个是用来与logo文字的间隔距离)
  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
