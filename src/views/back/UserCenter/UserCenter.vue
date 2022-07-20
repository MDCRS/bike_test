<template>
  <div style="text-align: center; opacity: 0.9">
    <el-popover
        placement="top-start"
        title="租车详情说明"
        width="200"
        trigger="hover"
        content="只能修改用户名，手机号，和头像信息，修改其他信息请联系管理员！"
        class="popover_div">
      <el-button slot="reference" class="editPerInfo" @click="editPerInfo" v-if="disabled">编辑</el-button>
      <template v-else-if="!disabled">
        <el-button slot="reference" class="editPerInfo" @click="cancel">取消</el-button>
        <el-button slot="reference" class="editPerInfo" @click="toSave">保存</el-button>
      </template>
    </el-popover>
    <el-descriptions title="个人信息" :column="2" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          头像
        </template>
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-image :src="reUserFrom.avatar"></el-image>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light" v-if="!disabled">
              <Upload @getUrl="setUrl" class="avatar">
                <el-button slot="uploadBtn" type="primary" class="upload_btn">上传头像</el-button>
                <div slot="uploadBtn" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </Upload>
            </div>
          </el-col>
        </el-row>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          用户名
        </template>
        <el-input type="text" :disabled="disabled" v-model="reUserFrom.username" @blur="checkUserName"
                  style="width: 200px"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          手机号
        </template>
        <el-input type="text" :disabled="disabled" v-model="reUserFrom.phone" style="width: 200px"></el-input>
        <br>
        <template style="width: 220px;" v-if="disabled===false">
          <span style="color: red">请预留正确的手机号</span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          信用分
        </template>
        {{ userInfo.creditValue < 0 ? 0:userInfo.creditValue}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          用户角色
        </template>
        <el-tag type="info" size="small" v-for="role in userInfo.roles">{{ role.name }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          用户等级
        </template>
        <el-tag type="info" size="small">{{ userInfo.sysLevel.level }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          用户状态
        </template>
        <el-tag type="success" size="small">{{ userInfo.status === 1 ? "正常" : "锁定" }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          上次登录
        </template>
        {{ userInfo.lastLogin }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions style="width:400px;margin-top: 10px;display: inline-block;float: left" title="个人账户" :column="1" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-finance"></i>
          充值金额
        </template>
        <el-input type="text" readonly v-model="this.userInfo.sysAccount.totalAmount"
                  @blur="checkUserName"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-wallet"></i>
          余额
        </template>
        <el-input type="text" readonly v-model="this.userInfo.sysAccount.balance"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-thumb"></i>
          点击充值
        </template>
        <el-button style="width: 200px" @click="toCharge">充值</el-button>
      </el-descriptions-item>
    </el-descriptions>
<!--    <div ref="userChat" class="bc"></div>-->
    <!--    充值dialog-->
    <el-dialog
        title="充值"
        :visible.sync="centerDialogVisible"
        width="30%"
        append-to-body
        center>
      <el-form label-width="100px">
        <el-form-item label="充金额：" size="large">
          <el-input type="text" v-model="charge.amount"></el-input>
        </el-form-item>
        <el-form-item label="充值方式：">
          <el-radio-group v-model="charge.paymentType" size="large">
            <el-radio label="aliPay">支付宝支付</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCharge">取 消</el-button>
        <el-button type="primary" @click="chargeAmount">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Upload from "@/components/upload";
import qs from "qs";
import * as echarts from "echarts";

export default {
  name: "UserCenter",
  computed: {
    userInfo: {
      get() {
        return JSON.parse(sessionStorage.getItem("loginUserInfo"))
      },
      set(val) {
        this.$store.state.user.userInfo = val
      }
    }
  },
  components: {Upload},
  data() {
    return {
      reAvatar: false,
      disabled: true,
      reUserFrom: {avatar: "", username: "", phone: "", code: '', key: ''},
      timer: null,
      isCountDown: false,
      times: 120,
      accountDisabled: true,
      centerDialogVisible: false,
      charge: {paymentType:"aliPay"},
      totalAmount: 0.0,
      balance: 0.0
    }
  },
  created() {
    this.reUserFrom.username = this.userInfo.username;
    this.reUserFrom.phone = this.userInfo.phone;
    this.reUserFrom.avatar = this.userInfo.avatar;
  },
  mounted() {
    // this.$nextTick(()=>{
    //   this.initBikeChat();
    // })
  },
  methods: {
    // initBikeChat(){
    //   let userChat = echarts.init(this.$refs.userChat);
    //   let option = {
    //     title: {
    //       text: '每月租车统计',
    //       subtext: '次数'
    //     },
    //     tooltip: {
    //       trigger: 'axis'
    //     },
    //     legend: {
    //       data: ['租车次数']
    //     },
    //     toolbox: {
    //       show: true,
    //       feature: {
    //         dataView: { show: true, readOnly: false },
    //         magicType: { show: true, type: ['line', 'bar'] },
    //         restore: { show: true },
    //         saveAsImage: { show: true }
    //       }
    //     },
    //     calculable: true,
    //     xAxis: [
    //       {
    //         type: 'category',
    //         // prettier-ignore
    //         data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    //       }
    //     ],
    //     yAxis: [
    //       {
    //         type: 'value'
    //       }
    //     ],
    //     series: [
    //       {
    //         name: '租车次数',
    //         type: 'bar',
    //         data: [
    //           2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
    //         ],
    //         markPoint: {
    //           data: [
    //             { type: 'max', name: 'Max' },
    //             { type: 'min', name: 'Min' }
    //           ]
    //         },
    //         markLine: {
    //           data: [{ type: 'average', name: 'Avg' }]
    //         }
    //       },
    //     ]
    //   }
    //   userChat.setOption(option);
    // },
    setUrl(url) {
      console.log(url);
      this.reUserFrom.avatar = url;
    },
    toSave() {
      this.$confirm('确定要修改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("toSave->this.reUserFrom=", this.reUserFrom)
        this.$axios.post('/sys/user/updateUserInfo?' + qs.stringify(this.reUserFrom))
            .then(res => {
              this.$message({
                type: 'success',
                message: res.data.msg+"请退出后重新登录"
              });
            }).catch(err => {
          this.$notify({
            type: 'error',
            title: '提示',
            message: '/sys/user/updateUserInfo-》请求失败',
            duration: 0
          });
        })
        this.disabled = !this.disabled;
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },
    editPerInfo() {
      this.disabled = !this.disabled;
      console.log("editPerInfo->this.reUserFrom=", this.reUserFrom)
    },
    cancel() {
      this.disabled = !this.disabled;
      this.reUserFrom.username = this.userInfo.username;
      this.reUserFrom.phone = this.userInfo.phone;
      console.log("cancel->this.reUserFrom=", this.reUserFrom);
    },
    countdownStart() {
      if (this.isCountDown) {
        return;
      }
      if (!this.reUserFrom.phone) {
        this.$message.error("手机号不能为空！");
        return;
      }
      this.$axios.post('/sendMs/' + this.reUserFrom.phone).then(res => {
        console.log("register->sendMs=", res.data.data.key)
        if (res.data.code === 200) {
          this.getCountDown();
          this.$message.success("短信发送成功，请注意查收！");
          this.reUserFrom.key = res.data.data.key
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
      if (this.disabled === false) {
        if (!this.reUserFrom.username) {
          this.$message.error("用户名不能为空");
          return
        }
        this.$axios.get('/checkUserName/' + this.reUserFrom.username).then(res => {
          console.log("checkUserName->res.data", res.data)
          if (res.data.code === 203) {
            this.$message.error(res.data.msg);
            this.reUserFrom.username = this.userInfo.username;
          }
        })
      }
    },
    cancelCharge() {
      this.centerDialogVisible = false;
      this.charge = {};
      this.getUserInfo();
    },
    toCharge() {
      this.centerDialogVisible = true;
    },
    getUserInfo() {
      this.$axios.get('/sys/userInfo').then(res => {
        console.log("BackNav->userInfo:", res.data.data)
        this.$store.commit('setUserInfo', res.data.data);
      })
    },
    chargeAmount() {
      let _this = this;
      this.charge.userId = this.userInfo.id
      this.$axios.post('/api/ali-pay/trade/page/pay', this.charge)
          .then(res => {
            console.log("/sys/user/charge->res.data->then=", res.data)
            if (res.data.code === 200) {
              this.centerDialogVisible = false;
              document.write(res.data.data)
              this.getUserInfo();
            } else {
              this.$notify({
                showClose: true,
                message: res.data.msg,
                type: 'info',
                duration: 0
              });
            }
          })
          .catch(err => {
            console.log("/sys/user/charge->res.data->err", err.data)
            this.$notify({
              showClose: true,
              message: "请求失败",
              type: 'error',
              duration: 0
            });
          })
    }
  },

}
</script>

<style scoped>
.el-image {
  width: 80px;
  height: 80px;
}

.avatar {
  margin-top: 17px;
  width: 100px;
}


.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  /*background: #99a9bf;*/
}

.bg-purple {
  /*background: #d3dce6;*/
}

.bg-purple-light {
  /*background: #e5e9f2;*/
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  /*background-color: #f9fafc;*/
}

.editPerInfo {
  float: right;
}

.el-popover {
  display: block !important;
}

.bc{
  height: 300px;
  width: 700px;
  display: inline-block;
  margin-top: 20px;
}
</style>