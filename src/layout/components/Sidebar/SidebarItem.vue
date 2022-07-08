<template>
<!-- 这里是菜单项的容器 -->
  <div v-if="!item.hidden">
    <!-- 有下拉菜单的情况 -->
    <!-- hasOneShowingChild(item.children,item) 判断当前的item是否没有子路由或者只有一个子路由
     !onlyOneChild.children||onlyOneChild.noShowingChildren 判断当前item中的唯一子路由是否还有子路由，和当前item还有的子路由
      是否都是hidden子路由
     !item.alwaysShow 判断当前的item是不是总是要作为根节点，即无论是否有子路由都要作为根节点(会有一个下拉框)-->
    <template v-if="hasOneShowingChild(item.children, item) &&(!onlyOneChild.children || onlyOneChild.noShowingChildren) &&!item.alwaysShow">   
      <!-- app-link是用来封装route-link，如果当前唯一子路由是合法子路由并且设置了meta 那么el-menu-item外就包了一层route-link  -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <!--el-menu-item是无扩展的菜单item index是每个item的标识，规则采用路由路径作为标识 -->
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <!-- 菜单项显示内容的组件 当前唯一子路由有icon就用当前的，没有就用父路由的 title就用当前唯一子路由的 -->
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title"/>
        </el-menu-item>
      </app-link>
    </template>

    <!-- 有下拉菜单的情况 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title"/>
      </template>
      <!-- :is-nest="true" 二次调用sidebar-item肯定是下拉后的子路由 -->
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" class="nest-menu"/>
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    item: {
      // 路由对象
      type: Object,
      required: true,
    },
     // 是否是下拉后才显示的节点描述变量
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      // 路由的路径
      type: String,
      default: "",
    },
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    // 判断是否该路由只有一个子路由
    hasOneShowingChild(children = [], parent) {
      // children = parent.children
      // 1.parent没有没有子路由 children=>[]  showingChildren=>[]  this.onlyOneChild=> undefined
      // 2.parent只有一个子路由 children=>[o1] showingChildren=>[o1] this.onlyOneChild=> o1
      // 3.parent有两个或者两个以上的子路由 children=>[o1,o2,o3,....] showingChildren=>[o1,o2,o3,....]  this.onlyOneChild=> 最后一个非隐藏对象
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          // 设置了hidden的直接过滤掉
          return false;
        } else {
          // 临时设置(当parent真的只有一个子路由的时候就会被用上)
          this.onlyOneChild = item;
          return true;
        }
      });

      // 当parent只有一个子路由，那就该子路由就是该parent的默认显示路由
      if (showingChildren.length === 1) {
        return true;
      }

      // 当parent没有子路由，那么久用该parent作为唯一的子路由
      // 没有设置hidden也没有设置children的路由，可以说是死路由，直接将path置空放在onlyOneChild中
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },

    resolvePath(routePath) {
      //^(https?:|mailto:|tel:)/.test(path)
      // 判断路径是否以https: 或者mailto: 或者tel: 开头 有的话则返回false,不可以包含这些
      if (isExternal(routePath)) {
        return routePath;
      }
      //^(https?:|mailto:|tel:)/.test(path)
      // 判断路径是否以https: 或者mailto: 或者tel: 开头 有的话则返回false,不可以包含这些
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>
