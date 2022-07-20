<template>
  <el-carousel :interval="3000" height="500px"  type="card" x indicator-position="outside">
    <el-carousel-item v-for="item in bikes" :key="item.id">
      <el-image :src="item.image" @click="toDetail(item.id)">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      bikes:[]
    }
  },
  created() {
    this.getBikeInfo();
  },
  methods:{
    toDetail(bikeId){
      this.$router.push({name: "FrontNavDetail", params: {id: bikeId}})
    },
    getBikeInfo() {
      this.$axios.get("/sys/bike/homeList", {
        params: {
          rent_status:1,
          bike_status:1
        }
      }).then(res => {
        if (res.data.code === 200){
          this.bikes = res.data.data
        }else{
          this.$message.error(res.data.msg)
        }
      })
    }
  },
}
</script>

<style scoped>
.el-carousel{
  margin-top: 25px;
  opacity: 0.9;
}
.el-carousel__item h3 {
  font-size: 18px;
  line-height: 500px;
  margin: 0;
}
</style>