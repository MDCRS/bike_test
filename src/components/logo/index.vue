<template>
  <div class="goHead">
    <i class="el-icon-bicycle" @click="goHeader"></i>
  </div>
</template>

<script>
export default {
  name: "Logo",
  methods:{
    goHeader(){
      this.$router.push({name:'FrontNavHome'});
      // this.$emit("getActive",-1);
    }
  },
}
</script>

<style scoped>
.goHead{
  width: 300px;
  height: 60px;
  /*background: #40ff60;*/
}
.el-icon-bicycle{
  font-size: 60px;
  color: white;
  position: relative;
  margin-right: 60px;
}

</style>