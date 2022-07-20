<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name:'App',
  watch:{
    $route(to,from){
      if(to.name !== 'FrontNavLogin' && to.path.includes('/back')){
        let obj = {
          name: to.name,
          title: to.meta.title
        }
        this.$store.commit('addTab',obj);
      }
      if (from.path.includes('/paySuccess')){
        this.$router.push("/uc")
        this.$store.commit('addTab',{title:'用户中心',name:'sys:center:info'})
      }
    }
  }
}
</script>

<style>
html,body,#app {
  font-family: 'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
  height: 100%;
  padding: 0;
  margin: 0;
  font-size: 15px;
}
</style>
