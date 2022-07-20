<template>
  <div style="opacity: 0.9">
    <el-form :model="passForm" status-icon :rules="rules" ref="passForm" label-width="100px">
      <el-form-item label="旧密码" prop="currentPass">
        <el-input type="password" show-password v-model="passForm.currentPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password" style="margin-bottom: 30px">
        <el-input type="password" show-password v-model="passForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" show-password v-model="passForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
        <el-button @click="resetForm('passForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  name: "Repass",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          type:"warning",
          showClose:true,
          message:"请再次输入密码",
        })
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passForm.password) {
        this.$message({
          type:"warning",
          showClose:true,
          message:"两次输入密码不一致",
          duration:0,
          onClose:()=>{
            this.passForm.checkPass = ""
          }
        })
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      passForm: {
        password: '',
        checkPass: '',
        currentPass: ''
      },
      rules: {
        password: [
          {
            required: true,
            min: 6,
            message: '密码必须满足大写+小写字母+数字+特殊符号（. _ ~ ! @ # $ ^ & *）,6-16个字符',
            max: 16,
            trigger: 'blur'
          },
          {
            pattern: /^(?![a-zA-Z]+$)(?![0-9]+$)(?![._~!@#$^&*]+$)(?![0-9a-zA-Z]+$)(?![0-9._~!@#$^&*]+$)(?![a-zA-Z._~!@#$^&*]+$)[A-Za-z0-9._~!@#$^&*]{6,16}$/,
            message: '密码必须满足大写+小写字母+数字+特殊符号（. _ ~ ! @ # $ ^ & *）,6-16个字符'
          }
        ],
        checkPass: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ],
        currentPass: [
          {required: true, message: '请输入当前密码', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          this.$axios.post('/sys/user/updatePass', this.passForm).then(res => {
            _this.$alert(res.data.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$refs[formName].resetFields();
              }
            });
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
}
</script>

<style scoped>

</style>