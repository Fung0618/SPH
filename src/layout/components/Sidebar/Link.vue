<template>
<!-- v-bind="{to: to}" 等同于=> :to="to" -->
<!-- <component></component>标签是Vue框架自定义的标签，
它的用途就是可以动态绑定我们的组件，根据数据的不同更换不同的组件  一定有is属性，is属性绑定的需要是一个组件-->
  <component :is="type" v-bind="linkProps(to)"> 
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    // 验证路由是否以https mailto: tel: 开头
    isExternal() {
      return isExternal(this.to)
    },

    type() {
      // 如果路径以https mailto: tel: 开头，则路由并非是组件路由，是普通的跳转链接，
      // 则将<component></component>变为<a></a>
      if (this.isExternal) {
        return 'a'
      }
      // 如果路径不以https mailto: tel: 开头 则路由是组件路由
      // 则将<component></component>变为<router-link></router-link>
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
