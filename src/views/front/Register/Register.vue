<template>
  <div class="reg_div">
    <el-row>
      <h1>欢迎注册</h1>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col>
        <el-form label-position="right" :rules="rules" label-width="90px" :model="regForm" ref="regForm">
          <el-form-item label="头像" prop="avatar" style="width: 390px;margin-bottom: 0">
            <Upload @getUrl="setUrl" class="avatar">
              <el-button slot="uploadBtn" type="primary" class="upload_btn">上传头像</el-button>
              <div slot="uploadBtn" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </Upload>
          </el-form-item>
          <el-form-item label="用户名" prop="username" style="width: 390px;">
            <el-input v-model="regForm.username" placeholder="请输入用户名" @blur="checkUserName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="width: 390px;margin-bottom: 30px">
            <el-input type="password" show-password v-model="regForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="confirmPass" style="width: 390px;margin-left: auto;margin-right: auto;">
            <el-input v-model="regForm.confirmPass" type="password" show-password placeholder="确认密码" @blur="confirmPass"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" style="width: 390px;">
            <el-input v-model="regForm.phone" placeholder="请输入手机号" @blur="selectUserByPhone"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code" style="width: 390px;">
            <el-input v-model="regForm.code" style="width: 172px; float: left;" maxlength="5" placeholder="请输入验证码"></el-input>
            <el-button @click="countdownStart()" class="cursor" v-if="isCountDown === false">获取验证码</el-button>
            <el-button v-else>{{ times }}秒后重试</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">立即注册</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import qs from 'qs'
import Upload from "@/components/upload";
export default {
  name: "Register",
  components:{Upload},
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.regForm.confirmPass !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      regForm: {
        avatar:'',
        username: '',
        password: '',
        confirmPass:'',
        phone: '',
        code: '',
        key:''
      },
      rules: {
        username: [
          {required: true, min: 3, max: 16, message: '请输入用户名3-16个字符', trigger: 'blur'}
        ],
        password: [
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
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {min: 4, max: 4, message: '验证码为4个字符', trigger: 'blur'}
        ],
      },
      timer: null,
      isCountDown: false,
      times: 60,
      formParams: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.regForm.validate((valid) => {
        if (valid) {
          this.$axios.post('/register?' + qs.stringify(this.regForm)).then(res => {
            this.$message.success("注册成功，快去登录吧！");
          }).catch(err => {
            console.log('error submit!!');
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    confirmPass(){
      let pass = this.regForm.password;
      let conPass = this.regForm.confirmPass;
      if (pass === conPass){
      }else if (pass !== conPass){
        this.$message({
          type:"warning",
          message:"两次输入的密码不一致，请重新输入！",
          showClose:true,
          duration:0,
          onClose:()=>{
            this.regForm.confirmPass = ""
          }
        })
      }
    },
    resetForm() {
      this.$refs.regForm.resetFields();
    },
    setUrl(url){
      console.log(url);
      this.regForm.avatar = url;
    },
    countdownStart() {
      if (this.isCountDown) {
        return;
      }
      if (!this.regForm.phone){
        return;
      }
      this.$axios.post('/sendMs/'+this.regForm.phone).then(res => {
        console.log("register->sendMs=",res.data.data.key)
        if (res.data.code === 200) {
          this.getCountDown();
          this.$message.success("短信发送成功，请注意查收！");
          this.regForm.key = res.data.data.key
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
    checkUserName() {
      if (!this.regForm.username) {
        // this.$message.error("用户名不能为空");
        return
      }
      this.$axios.get('/checkUserName/' + this.regForm.username)
          .then(res => {
            console.log("this.regForm.username=",res.data)
            if (res.data.data){
              this.$message.error(res.data.msg);
            }
          })
    },
    selectUserByPhone(){
      if (!this.regForm.phone) {
        // this.$message.error("手机号不能为空");
        return
      }
      this.$axios.get('/checkPhone/'+this.regForm.phone).then(res=>{
        console.log("this.regForm.phone=",res.data)
        if (res.data.data){
          this.$message.error(res.data.msg);
        }
      })
    }
  },
}
</script>

<style scoped>
.reg_div {
  position: relative;
  width: 50%;
  margin-right: auto;
  margin-left: auto;
  opacity: 0.9;
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
}
.avatar{
  position: relative;
}
</style>