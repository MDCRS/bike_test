<template>
  <div class="login_div">
    <el-row>
      <h1>欢迎登录</h1>
    </el-row>
    <el-row>
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户名登录" name="first">
          <el-row type="flex" class="row-bg" justify="center">
            <el-form label-position="right" :rules="rules" label-width="80px" :model="loginForm" ref="loginForm">
              <el-form-item label="用户名" prop="username" style="width: 380px;">
                <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" style="width: 380px;">
                <el-input type="password" show-password placeholder="请输入密码" v-model="loginForm.password"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="code" style="width: 380px;">
                <el-input v-model="loginForm.code" placeholder="请输入验证码" style="width: 172px; float: left;" maxlength="5"></el-input>
                <el-image class="captchaImg" :src="captchaImg" @click="getCaptcha"></el-image>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <router-link to="/front/reg" style="color: #99a9bf;text-decoration: none;font-size: 12px">注册账号</router-link>
            <el-divider direction="vertical"></el-divider>
            <router-link to="/front/repass/checkUser" style="color: #99a9bf;text-decoration: none;font-size: 12px">
              忘记密码？
            </router-link>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="手机号登录" name="second">
          <el-row type="flex" class="row-bg" justify="center">
            <el-form label-position="right" :rules="smsRules" label-width="80px" :model="smsLoginForm" ref="smsLoginForm">
              <el-form-item label="手机号" prop="phone" style="width: 380px;">
                <el-input v-model="smsLoginForm.phone" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="smsCode" style="width: 390px;">
                <el-input v-model="smsLoginForm.smsCode" style="width: 172px; float: left;" maxlength="4" placeholder="请输入验证码"></el-input>
                <el-button @click="countdownStart()" class="cursor" v-if="isCountDown === false">获取验证码</el-button>
                <el-button v-else>{{ times }}秒后重试</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitSmsForm">提交</el-button>
                <el-button @click="resetSmsForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>


  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
import store from "@/store";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
        token: ''
      },
      smsLoginForm:{
        phone:'',
        smsCode:'',
      },
      activeName: 'first',
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {min: 5, max: 5, message: '验证码为5个字符', trigger: 'blur'}
        ],
      },
      smsRules:{
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        smsCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {min: 4, max: 4, message: '验证码为4个字符', trigger: 'blur'}
        ],
      },
      captchaImg: "",
      times: 60,
      timer: null,
      isCountDown: false,
    }
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    getUserInfo() {
      this.$axios.get('/sys/userInfo').then(res => {
        this.$store.commit('setUserInfo', res.data.data);
      })
    },
    submitForm() {
      let _this = this;
      this.$refs.loginForm.validate((valid) => {
        if (sessionStorage.getItem("loginUserInfo") !== null) {
          this.$message.warning("您已登录请不要重复登录！");
          return;
        }
        if (valid) {
          this.$axios.post('/login?' + qs.stringify(this.loginForm)).then(res => {
            console.log('login->res.data', res.data);
            const jwt = res.headers['authorization']
            this.$store.commit('SET_TOKEN', jwt)
            this.getUserInfo();
            if (res.data.data.resCode === 2000) {
              this.$notify({
                type: "success",
                showClose: true,
                message: res.data.data.resMsg,
                during: 0,
                onClose() {
                  _this.$router.push("/back/backHome");
                  _this.$router.go(-2);
                }
              })
            }
            if (res.data.data.resCode === 3000) {
              this.$notify({
                type: "info",
                showClose: true,
                message: res.data.data.resMsg,
                during: 0,
                onClose() {
                  _this.$router.push("/back/backHome");
                  _this.$router.go(-2);
                }
              })
            }
          }).catch(err => {
            this.getCaptcha();
            console.log('error submit!!');
          })
        } else {
          this.getCaptcha();
          console.log('error submit!!');
          return false;
        }
      })
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    getCaptcha() {
      this.$axios.get('/captcha').then(res => {
        this.loginForm.token = res.data.data.token;
        this.captchaImg = res.data.data.captchaImg;
        this.loginForm.code = '';
      })
    },
    countdownStart() {
      if (this.isCountDown) {
        return;
      }
      if (!this.smsLoginForm.phone){
        this.$message.error("手机号不能为空！");
        return;
      }
      this.$axios.get('/sendLoginMs/'+this.smsLoginForm.phone).then(res => {
        if (res.data.code === 200) {
          this.getCountDown();

          if (res.data.data.reStr === 'success') {
            this.$message.success("短信发送成功，请注意查收！");
          }else{
            this.$message.success("短信发送失败！");
          }
          // this.$message.success(res.data.data.);
          console.log(res.data)
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
    submitSmsForm() {
      let _this = this;
      this.$refs.smsLoginForm.validate((valid) => {
        if (sessionStorage.getItem("loginUserInfo") !== null) {
          this.$message.warning("您已登录请不要重复登录！");
          return;
        }
        if (valid) {
          this.$axios.post('/sms/login?' + qs.stringify(this.smsLoginForm)).then(res => {
            console.log('login->res.data', res.data);
            const jwt = res.headers['authorization']
            this.$store.commit('SET_TOKEN', jwt)
            this.getUserInfo();
            if (res.data.data.resCode === 2000) {
              this.$notify({
                type: "success",
                showClose: true,
                message: res.data.data.resMsg,
                during: 0,
                onClose() {
                  _this.$router.push("/back/backHome");
                  _this.$router.go(-2);
                }
              })
            }
            if (res.data.data.resCode === 3000) {
              this.$notify({
                type: "info",
                showClose: true,
                message: res.data.data.resMsg,
                during: 0,
                onClose() {
                  _this.$router.push("/back/backHome");
                  _this.$router.go(-2);
                }
              })
            }
          }).catch(err => {
            console.log('error submit!!');
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    resetSmsForm() {
      this.$refs.smsLoginForm.resetFields();
    },
  }
}
</script>

<style scoped>
.login_div {
  position: relative;
  width: 50%;
  margin-right: auto;
  margin-left: auto;
  margin-top: 60px;
  border-radius: 5px;
  opacity: 0.9;
}

::v-deep .el-tabs__nav-scroll {
  width: 50% !important;
  margin-left: 280px !important;
  margin-right: auto !important;
}


.el-col {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;

}

.el-row {
  height: 100%;
  background-color: #fafafa;
}

.el-divider {
  height: 20px;
}

.captchaImg {
  float: left;
  margin-left: 8px;
  border-radius: 5px;
}
</style>