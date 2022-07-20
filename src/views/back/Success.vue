<template>
  <div class="bg-fa of" style="padding: 40px;">
    <el-alert
        title="支付成功"
        show-icon
        type="success"
        :close="toCenter">
      <template slot="default">{{ count }}秒后，回到用户中心!</template>
    </el-alert>
  </div>
</template>

<script>

export default {

  data() {
    return {
      count: 5,
      timer: null
    }
  },
  created() {
    this.getCountDown()
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    toCenter() {
      this.$router.push("/back/backHome")
    },
    getCountDown() {
      if (this.timer !== null){
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.count--
        if (this.count === -1) {
          this.count = 5;
          clearInterval(this.timer)
          this.$router.push("/back/backHome");
        }
      }, 1000)
    },
  }
}
</script>
<style>
.el-alert {
  height: 100px;
}

.el-alert__icon.is-big {
  font-size: 40px;
  margin-right: 15px;
  margin-bottom: 25px;
}

.el-alert__title.is-bold {
  font-size: 30px;
}
</style>
