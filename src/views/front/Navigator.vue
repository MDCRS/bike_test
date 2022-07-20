<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
        <router-view></router-view>
    </el-main>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>
import Header from "@/views/front/Header/Header";
import Footer from "@/views/front/Footer/Footer";
export default {
  name: "FrontNav",
  components:{Header,Footer}
}
</script>

<style scoped>
.el-header{
  background-color: #555d65;
  height: 65px !important;
}

.el-footer{
  background-color: #555d65;
  text-align: center;
  height: 80px !important;
}

.el-main {
  text-align: center;
  height: 600px;
  background-image: url("../../assets/backImage/74a11778c095c7f0b657fe4ae0299151.jpg");
  background-repeat:no-repeat;
  background-size:1530px 620px;
}
</style>