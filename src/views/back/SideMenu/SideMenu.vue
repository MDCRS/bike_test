<template>
  <el-menu
      :default-active="this.$store.state.user.editableTabsValue"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
  >
    <router-link to="/front/frontHome">
      <el-menu-item index="Index" @click="addMenuTab({title: '首页',name: 'BackNavIndex'})">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </template>
      </el-menu-item>
    </router-link>
    <el-submenu :index="menu.title" v-for="menu in menuList">
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </template>
      <router-link :to="item.path" v-for="item in menu.children">
        <el-menu-item :index="item.name" @click="addMenuTab(item)">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </router-link>
    </el-submenu>
  </el-menu>
</template>

<script>

export default {
  name: "SideMenu",
  computed:{
    menuList:{
      get(){
        return this.$store.state.user.menuList
      }
    }
  },
  methods:{
    addMenuTab(tab) {
      this.$store.commit('addTab',tab)
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
}

a {
  text-decoration: none;
}
</style>