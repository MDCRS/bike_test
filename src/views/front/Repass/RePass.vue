<template>
  <el-container>
    <el-header>
      <el-steps :active="this.$store.state.user.activeStep" finish-status="success" simple style="margin-top: 20px">
        <el-step title="填写用户名"></el-step>
        <el-step title="验证身份"></el-step>
        <el-step title="设置新密码"></el-step>
      </el-steps>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "RePass",
  created() {
    this.$router.push({name: 'FrontNavCU'});
    this.$store.commit('setActiveStep',0);
  },
}
</script>

<style scoped>
.el-header{
  opacity: 0.9;
}
.el-steps {
  width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.el-main {
  width: 1400px;
  height: 400px;
  margin-left: auto;
  margin-right: auto;
  align-content: center;
  padding-left: 50px;
  opacity: 0.9;
}
</style>