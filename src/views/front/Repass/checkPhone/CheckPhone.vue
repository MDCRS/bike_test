<template>
  <el-card shadow="always">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col>
        <el-form label-position="right" :rules="rules" label-width="80px" :model="checkUser" ref="checkUser">
          <el-form-item label="手机号:" prop="phone" style="width: 380px;margin-left: auto;margin-right: auto;">
            <el-input v-model="checkUser.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native="next" style="width: 380px;height: 45px;margin-right: 50px;">下一步
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "CheckPhone",
  data(){
    return{
      rules: {
        phone: [
          {required: true, trigger: 'blur',message: '请输入手机号'},
          {pattern:/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\\d{8}$/,message: '请输入正确的手机号'}
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
      this.$axios.get('/checkUserByNameAndPhone/' + this.checkUser.username+"/"+this.checkUser.phone)
          .then(res => {
            if (res.data.code === 200) {
              if (res.data.msg !== null){
                this.$message({
                  showClose:true,
                  message:res.data.msg,
                  type:"warning"
                })
                this.checkUser.phone = ""
                return;
              }
              this.$router.push({name: 'FrontNavFin'});
              this.$store.commit('next', 2)
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