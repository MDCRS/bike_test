<template>
  <el-card shadow="always">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col>
        <el-form label-position="right" :rules="rules" label-width="90px" :model="checkUser" ref="checkUser">
          <el-form-item label="新密码:" prop="newPass"
                        style="width: 390px;margin-left: auto;margin-right: auto;margin-bottom: 30px">
            <el-input v-model="checkUser.newPass" type="password" show-password placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="confirmPass" style="width: 390px;margin-left: auto;margin-right: auto;">
            <el-input v-model="checkUser.confirmPass" type="password" show-password placeholder="确认密码"></el-input>
          </el-form-item>
          <el-form-item label="验证码:" prop="code" style="width: 390px;margin-left: auto;margin-right: auto;">
            <el-input v-model="checkUser.code" style="width: 172px; float: left;" maxlength="5"></el-input>
            <el-button @click="countdownStart()" class="cursor" v-if="isCountDown === false">获取验证码</el-button>
            <el-button v-else>{{ times }}秒后重试</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native="next" style="width: 380px;height: 45px;margin-right: 50px;">完成
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import qs from "qs";

export default {
  name: "Finish",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.checkUser.newPass !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      timer: null,
      isCountDown: false,
      times: 120,
      rules: {
        newPass: [
          {
            required: true,
            min: 6,
            message: '密码必须满足大写+小写字母+数字+特殊符号（. _ ~ ! @ # $ ^ & *）,6-16个字符',
            max: 16,
            trigger: 'blur'
          },
          {pattern: /^(?![a-zA-Z]+$)(?![0-9]+$)(?![._~!@#$^&*]+$)(?![0-9a-zA-Z]+$)(?![0-9._~!@#$^&*]+$)(?![a-zA-Z._~!@#$^&*]+$)[A-Za-z0-9._~!@#$^&*]{6,16}$/,
            message: '密码必须满足大写+小写字母+数字+特殊符号（. _ ~ ! @ # $ ^ & *）,6-16个字符'
          }
        ],
        confirmPass: [
          {required: true, message: "确认密码不能为空", trigger: "blur"},
          {required: true, validator: equalToPassword, trigger: "blur"}
        ],
        code: [
          {required: true, message: '请输入验证码', min: 4, max: 4, trigger: 'blur'}
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
      this.$axios.post('/rePassWord?'+ qs.stringify(this.checkUser))
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                showClose: true,
                message: res.data.data,
                type: 'success',
                onClose: () => {
                  this.$store.commit('next', 3)
                }
              });
              setTimeout(()=>{
                this.$router.push({name: 'FrontNavLogin'});
              },10000)
            }
          })
          .catch(err => {
            this.$message.error("请求失败！");
          })
      console.log("Finish->this.checkUser=", this.checkUser);
    },
    countdownStart() {
      if (this.isCountDown) {
        return;
      }
      this.$axios.post('/sendMs/' + this.checkUser.phone).then(res => {
        console.log("register->sendMs=", res.data.data.key)
        if (res.data.code === 200) {
          this.getCountDown();
          this.$message.success("短信发送成功，请注意查收！");
          this.checkUser.key = res.data.data.key
        } else {
          this.$message.error("获取失败！");
        }
      })
    },
    getCountDown() {
      this.isCountDown = true
      this.timer = setInterval(() => {
        this.times--
        if (this.times === 0) {
          this.times = 120;
          this.isCountDown = false
          clearInterval(this.timer)
        }
      }, 1000)
    },
  }
}
</script>

<style scoped>
.el-card {
  width: 800px;
  height: 300px;
  position: relative;
  padding-top: 40px;
  margin-left: 250px;
}

</style>