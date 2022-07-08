<template>
  <!-- 这里是左侧菜单组件 -->
  <!-- 根据showLogo来控制是否添加一个has-logo的类名 -->
  <div :class="{ 'has-logo': showLogo }">
    <!-- logo组件，专门写存放logo showLogo控制组件的显示 并且传入collapse参数-->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 菜单栏组件 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 菜单栏主要组件 -->
      <!-- default-active="activeMenu" 默认展开的标识index
            :collapse="isCollapse" 是否水平折叠
            :background-color="variables.menuBg" 背景颜色
            :text-color="variables.menuText" 文字颜色
            :active-text-color="variables.menuActiveText" 激活状态的文字颜色 
            :collapse-transition="false" 是否开启折叠动画
             mode="vertical" 水平模式-->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import _ from "lodash";
import { authRoutes, whitelist } from "@/router";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.getTrueRoutesByUser(authRoutes,whitelist);
    },
    //
    activeMenu() {
      // 拿到当前的路由对象
      const route = this.$route;
      // 解构出meta和path
      // meta对象中如果是一级路由会有title和icon属性，如果是二级路由只有title属性
      // path就是当前路由的路径
      const { meta, path } = route;
      // 如果在路由的meta中设置了默认展开路径,则用我们设置的
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      // 没有设置则用当前的路径(用路由路径作为展开的index标识)
      return path;
    },
    // 用来控制是否显示左侧菜单栏标logo的变量
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    // 变量
    variables() {
      return variables;
    },
    // 传入到logo组件中的属性
    // this.sidebar --->  getters ----> app.state ---> sidebar=>{opened:xxx,withoutAnimation:xxx}
    // 1.第一次进入主页的时候是没有委派去修改app的state中的siderbar中的opened的,如果没有设置值，所以一上来获取到空的东西
    // 经过逻辑处理，获取到空的东西返回的opened是true,所以isCollapse初始值为false
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    // 递归来根据用户的可访问路由来过滤出用户本身的权限路由
    getAuthRoutesForUser(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (this.$store.getters.routes.indexOf(arr[i].name) != -1) {
          if (arr[i].children && arr[i].children.length) {
            this.getAuthRoutesForUser(arr[i].children);
          }
        } else {
          arr.splice(i, 1);
          i = i - 1;
        }
      }
    },
    // 计算当前用户侧边栏的动态显示以及动态路由的方法
    getTrueRoutesByUser(authRoutes, whitelist) {
      // 拿到路由配置对象数组
      // 这里默认什么角色都是全部菜单显示
      // 所以需要根据当前用户的路由权限配置出当前用户可以取得routes来做到不同权限的用户登录后
      // 能操作对应不同的菜单
      // 这里的操作可以放在vuex中进行,方便路由文件和导航的获取
      let temAuthRoutes = _.cloneDeep(authRoutes);
      this.getAuthRoutesForUser(temAuthRoutes);
      temAuthRoutes = whitelist.concat(temAuthRoutes);
      // 将{ path: '*', redirect: '/404', hidden: true } 放到最后
      temAuthRoutes.forEach((item, index) => {
        if (item.path == "*") {
          temAuthRoutes.push(item);
          temAuthRoutes.splice(index, 1);
        }
      });
      // 动态路由
      this.$router.options.routes = temAuthRoutes
      console.log(this.$router.options.routes,temAuthRoutes)
      return temAuthRoutes;
    },
  },
};
</script>
