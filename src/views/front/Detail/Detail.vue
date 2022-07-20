<template>
  <div class="contain">
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <img :src="bike.image">
          <div class="description">
            <el-tabs type="border-card">
              <el-tab-pane>
                <span slot="label"><i class="el-icon-document"></i> 车辆描述</span>
                <el-input type="textarea" v-model="bike.des" readonly></el-input>
              </el-tab-pane>
              <el-tab-pane label="车辆评价">
                <span slot="label"><i class="el-icon-view"></i> 车辆评价</span>
                <div style="height: 200px;width: 580px" class="scroll-view" ref="scrollView">
                  <template v-for="item in remarks">
                    <el-tag type="success" style="margin-right: 400px;width: 150px;border-radius: 30px">
                      <el-col :span="12">
                        <el-avatar size="small" :src="item.avatar"></el-avatar>&nbsp;
                      </el-col>
                      <el-col :span="12">
                        <i style="font-size: 12px">{{ item.username }}</i>
                      </el-col>
                    </el-tag>
                    <el-input type="text" v-model="item.content" style="margin-bottom: 6px" readonly></el-input>
                  </template>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <el-card style="height: 580px;">
          <div class="grid-content bg-purple">
            <el-form ref="rent_form" :model="bike">
              <el-form-item>
                <el-descriptions class="margin-top" title="基本信息:" :column="2" size="medium " border>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-user"></i>
                      车主名
                    </template>
                    {{ userInfo.username }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-mobile-phone"></i>
                      手机号
                    </template>
                    {{ userInfo.phone }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-tickets"></i>
                      自行车状况
                    </template>
                    <el-tag size="small">{{ bike.bikeStatus === 1 ? '良好' : '维修中' }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-tickets"></i>
                      出租状况
                    </template>
                    <el-tag size="small">{{ bike.rentStatus === 1 ? '未出租' : '已出租' }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-coin"></i>
                      租车价格
                    </template>
                    <el-tag size="small">{{ bike.rentPrice }}元/小时</el-tag>
                    <el-tag style="margin-left: 5px" size="small">{{ bike.dayPrice }}元/天</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-coin"></i>
                      押金
                    </template>
                    <el-tag size="small">{{ bike.deposit }}元</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-s-data"></i>
                      该车共被租车
                    </template>
                    <el-tag size="small">{{ bike.rentCount }}次</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-s-data"></i>
                      车辆停放位置
                    </template>
                    <el-tag size="small">{{ bike.address }}</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </el-form-item>
              <el-form-item>
                <el-descriptions class="margin-top" title="请选择租车时间：" :column="1" size="medium " border>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-timer"></i>
                      租车时间
                    </template>
                    <el-date-picker
                        v-model="between"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH"
                        format="yyyy-MM-dd HH"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @blur="toCountPrice"
                    >
                    </el-date-picker>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-coin"></i>
                      租车金额
                    </template>
                    <el-tag size="small">{{ price }}元</el-tag>
                    <select v-model="unit" @change="toCountPrice"  style="width: 100px;height:25px;margin-left: 20px">
                      <option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </option>
                    </select>
                  </el-descriptions-item>
                </el-descriptions>
              </el-form-item>
              <el-form-item style="margin-bottom: 5px">
<!--                label="我已阅读并同意租车协议"-->
                <el-checkbox v-model="agreement" label="我已阅读并同意租车协议" border size="medium"></el-checkbox>
                <el-link @click="readTheAgreement = true" style="margin-left: 10px;margin-bottom: 7px;position: relative;" :underline="false">《租车协议》</el-link>
              </el-form-item>
              <el-form-item>
                <el-button class="sub_btn" @click="subRentBikeForm" >提交租单</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--    阅读协议弹框-->
    <el-dialog
        title="租车协议"
        :visible.sync="readTheAgreement"
        width="30%"
        :show-close="false"
        center>
      <div class="scroll-view" ref="scrollView" id="scroll-view" @scroll="scroll">
        <div v-for="(item, index) in proxies" :key="index" class="list-item">
          {{ item.content }}
        </div>
      </div>
      <div class="btn">
        <el-button :disabled="isFlag" @click="readTheAgreement = false">已阅读,下一步</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Detail",
  data() {
    return {
      bike: {},
      userInfo: {},
      between: '',
      subForm: {},
      price: 0,
      accountForm: {},
      readTheAgreement: true,
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      isFlag: true,
      agreement: false,
      remarks: [],
      count: 0,
      proxies: [],
      options: [{
        value: 0,
        label: '每小时'
      }, {
        value: 1,
        label: '每天'
      }],
      unit:0,
    }
  },
  computed: {
    loginUserInfo: {
      get() {
        return this.$store.state.user.userInfo;
      }
    }
  },
  created() {
    this.getBikeInfoById()
    this.readTheAgreement = true;
    this.getRemark()
    this.getProxies()
  },
  methods: {
    load() {
      this.count += 2
    },
    getBikeInfoById() {
      this.$axios.get('/sys/bike/info/' + this.$route.params.id).then(res => {
        console.log("getBikeInfoById-->/sys/bike/info/-->res.data.data=", res.data.data)
        this.bike = res.data.data.bikeInfo;
        this.userInfo = res.data.data.userInfo;
      })
    },
    scroll(e) {
      const {scrollTop, clientHeight, scrollHeight} = e.target;
      if (((scrollTop + clientHeight) | 0) === scrollHeight) {
        this.isFlag = false;
      }
    },
    toCountPrice() {
      this.subForm.startDate = this.between[0]
      this.subForm.endDate = this.between[1]
      this.$axios.get("/sys/bikeRent/toCountPrice", {
        params: {
          startDateTime: this.between[0],
          endDateTime: this.between[1],
          hourPrice: this.bike.rentPrice,
          dayPrice:this.bike.dayPrice,
          unit:this.unit
        }
      }).then(res => {
        console.log("toCountPrice->res.data", res.data)
        if (res.data.data.key === 2001) {
          this.price = parseFloat(res.data.data.format);
        }else if (res.data.data.key === 3001){
          this.$notify({
            type:"warning",
            message:res.data.data.strMsg,
            showClose:true,
            duration:0,
            onClose:()=>{}
          });
          this.unit = 0;
        }

      })
    },
    getUserInfo() {
      this.$axios.get('/sys/userInfo').then(res => {
        this.$store.commit('setUserInfo', res.data.data);
      })
    },
    subRentBikeForm() {
      if (this.loginUserInfo.creditValue<=50){
        this.$notify({
          showClose:true,
          type:"warning",
          message:"您的信用值不足！",
          duration:0,
        })
        return;
      }
      let _this = this;
      this.subForm.bikeId = this.$route.params.id;
      this.subForm.rentId = this.loginUserInfo.id
      this.subForm.startDate = this.between[0]
      this.subForm.endDate = this.between[1]
      this.subForm.rentPrice = this.price
      this.subForm.deposit = this.bike.deposit
      this.subForm.agreement = this.agreement === true ? 1 : 0
      if (this.subForm.rentId == null) {
        this.$notify({
          showClose: true,
          message: '请先登录！',
          type: 'warning',
          duration: 0,
          onClose: () => {
            this.$router.push({name: "FrontNavLogin"});
          }
        });
      } else if (this.agreement === false) {
        this.$notify({
          showClose: true,
          message: '请勾选我以阅读并同意租车协议',
          type: 'warning',
          duration: 0,
        });
      } else if (this.subForm.startDate === null || this.subForm.endDate === null || this.subForm.rentPrice === 0){
        this.$notify({
          showClose: true,
          message: '请选择租车时间',
          type: 'warning',
          duration: 0,
        });
      }else {
        this.$axios.post('/sys/bikeRent/save', this.subForm)
            .then(response => {
              console.log("/sys/bikeRent/save-->response.data=", response.data);
              if (response.data.code === 200) {
                this.$notify({
                  showClose: true,
                  message: response.data.data,
                  type: 'success',
                  duration: 0,
                  onClose: () => {
                    this.$router.push({name: "sys:center:rent"})
                    this.$store.commit('addTab', {name: 'sys:center:rent', title: '个人租单'})
                  }
                });
              }
            })
            .catch(error => {
              this.$notify({
                showClose: true,
                message: "请求失败",
                type: 'fail',
                duration: 0,
              });
            })
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    toPayDialog() {
      this.payDialogVisible = true;
    },
    notPay() {
      this.payDialogVisible = false;
    },
    toPay() {
      if (this.$store.state.user.userInfo.id === null) {
        console.log("if->this.$store.state.user.userInfo=", this.loginUserInfo);
        this.$message({
          showClose: true,
          message: '请先登录！',
          type: 'error',
        });
      } else {
        console.log("else");
        this.accountForm.rentId = this.loginUserInfo.id;
        this.accountForm.bikeId = this.bike.id;
        this.accountForm.hostId = this.bike.userId;
        this.accountForm.totalPrice = this.price;
        this.$axios.post('/sys/bikeRent/rentPay', this.accountForm)
            .then(res => {
              console.log("/sys/bikeRent/rentPay->res.data=", res.data);
              if (res.data.code === 201) {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'info',
                });
              } else if (res.data.code === 202) {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'success',
                });
              }
            }).catch(err => {
          console.log("/sys/bikeRent/rentPay->res.data=", err.data);
        })
      }
    },
    getRemark() {
      this.$axios.get('/sys/bike/remark/' + this.$route.params.id)
          .then(res => {
            this.remarks = res.data.data
          })
          .catch(err => {
            console.log("getRemark--》请求失败！")
          })
    },
    getProxies() {
      this.$axios.get('/sys/bike/proxy')
          .then(res => {
            this.proxies = res.data.data
          })
          .catch(err => {
            console.log("getRemark--》请求失败！")
          })
    }
  },

}
</script>

<style scoped>
.el-row {
  width: 100%;
  height: 490px;
  margin-top: 12px;
  opacity: 0.9;
}

.el-tabs {
  height: 255px;
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
  min-height: 490px;
}

.row-bg {
  padding: 10px 0;
  /*background-color: #f9fafc;*/
}

img {
  position: relative;
  width: 600px;
  height: 300px;
  border-radius: 5px;
}

.description {
  position: relative;
  width: 100%;
  margin-left: 5px;
  height: 255px;
}

.sub_btn {
  position: relative;
  width: 100%;
  border-radius: 30px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.scroll-view {
  width: 400px;
  height: 250px;
  overflow-y: scroll;
  background-color: #68b687;
}

.btn {
  width: 400px;
  margin-top: 20px;
  text-align: center;
}

.list-item {
  padding: 40px 0;
  text-align: center;
  color: #fff;
}

.list-item:nth-child(2n + 1) {
  background-color: rgba(0, 0, 0, 0.2);
}

.list-item:nth-child(2n + 2) {
  background-color: rgba(222, 221, 221, 0.2);
}

.el-tabs {
  width: 600px;
  margin-left: 115px;
  border-radius: 10px;
  margin-top: 20px;
}
</style>