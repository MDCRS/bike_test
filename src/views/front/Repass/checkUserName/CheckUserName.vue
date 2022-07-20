<template>
  <el-card shadow="always">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col>
        <el-form label-position="right" :rules="rules" label-width="80px" :model="checkUser" ref="checkUser">
          <el-form-item label="用户名:" prop="username" style="width: 380px;margin-left: auto;margin-right: auto;">
            <el-input v-model="checkUser.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next" style="width: 380px;height: 45px;margin-right: 50px;">下一步
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "CheckUserName",
  data() {
    return {
      rules: {
        username: [
          {required: true, min: 3, max: 16, message: '请输入用户名3-16个字符', trigger: 'blur'}
        ],
      }
    }
  },
  computed: {
    checkUser: {
      get() {
        return this.$store.state.user.checkUser
      },
      set(val) {
        this.$store.state.user.checkUser = val;
      }
    }
  },
  methods: {
    next() {
      this.$axios.get('/checkUserByName/' + this.checkUser.username)
          .then(res => {
            if (res.data.code === 200) {
              if (res.data.msg !== null){
                this.$message({
                  showClose:true,
                  message:res.data.msg,
                  type:"warning"
                })
                this.checkUser.username = ""
                return;
              }
              this.$router.push({name: 'FrontNavCp'});
              this.$store.commit('next', 1)
            }
          })
    }
  }

}
</script>

<style scoped>
.el-card {
  width: 800px;
  height: 250px;
  position: relative;
  padding-top: 80px;
  margin-left: 250px;
}

</style>