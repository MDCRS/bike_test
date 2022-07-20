<template>
  <div style="opacity: 0.9">
    <el-form :inline="true">
      <el-form-item>
        <el-input
            v-model="searchForm.brand"
            placeholder="请输入车牌"
            clearable
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getBikeListByUserId">搜索</el-button>
      </el-form-item>

      <el-form-item>
        <!--        v-if="hasAuth('sys:user:save')"-->
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <!--          v-if="hasAuth('sys:user:delete')"-->
          <el-button type="danger" slot="reference" :disabled="delBtlStatus">批量删除
          </el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table
        ref="multipleTable"
        :data="bikes"
        tooltip-effect="dark"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange">
      <el-table-column
          fixed
          type="selection"
          align="center"
          width="55">
      </el-table-column>
      <el-table-column
          label="图片"
          align="center"
          width="50">
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.image"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
          prop="bikeName"
          label="车名"
          align="center"
          width="120">
      </el-table-column>
      <el-table-column
          prop="brand"
          align="center"
          label="品牌"
          width="120">
      </el-table-column>
      <el-table-column
          prop="rentPhone"
          label="租主联系电话"
          align="center"
          width="120">
        <template slot-scope="scope">
          {{ scope.row.rentPhone === "" || scope.row.rentPhone === null ? "暂无" : scope.row.rentPhone }}
        </template>
      </el-table-column>
      <el-table-column
          prop="rentName"
          label="租主用户名"
          align="center"
          width="120">
        <template slot-scope="scope">
          {{ scope.row.rentName === "" || scope.row.rentName === null ? "暂无" : scope.row.rentName }}
        </template>
      </el-table-column>
      <el-table-column
          prop="endDate"
          label="租车截至日期"
          width="200px"
          align="center">
        <template slot-scope="scope">
          {{ scope.row.endDate === "" || scope.row.endDate === null ? "暂无" : scope.row.endDate }}
        </template>
      </el-table-column>
      <el-table-column
          prop="rentPrice"
          label="租金"
          align="center"
          width="170">
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.rentPrice }}元/小时</el-tag>
          <el-tag style="margin-left: 5px" size="small">{{ scope.row.dayPrice }}元/天</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="deposit"
          label="押金"
          align="center"
          width="120">
        <template slot-scope="scope">
          {{ scope.row.deposit }}元
        </template>
      </el-table-column>
      <el-table-column
          prop="address"
          label="停放位置"
          align="center"
          width="120">
      </el-table-column>
      <el-table-column
          prop="rent_status"
          align="center"
          label="租借状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.rentStatus === 2" type="success">预租中</el-tag>
          <el-tag size="small" v-if="scope.row.rentStatus === 3" type="success">还车中</el-tag>
          <el-tag size="small" v-if="scope.row.rentStatus === 1" type="success">未出租</el-tag>
          <el-tag size="small" v-else-if="scope.row.rentStatus === 0" type="danger">已出租</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="bike_status"
          align="center"
          width="120"
          label="自行车状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.bikeStatus === 1" type="success">良好</el-tag>
          <el-tag size="small" v-else-if="scope.row.bikeStatus === 0" type="danger">维修中</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="des"
          width="120"
          label="车辆描述">
        <template slot-scope="scope">
          <el-popover
              placement="top-start"
              title="租车详情说明"
              width="200"
              trigger="hover"
              :content="scope.row.des"
              class="popover_div">
            <el-tag slot="reference">查看租车说明</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
          prop="isAgree"
          width="120"
          align="center"
          label="支付状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.isPay === 1" type="success">已支付</el-tag>
          <el-tag size="small" v-else-if="scope.row.isPay === 0" type="danger">未支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="isAgree"
          width="200"
          align="center"
          label="是否同意出租">
        <template slot-scope="scope">
          <el-button size="small" @click="agree(scope,1)" type="success">同意
          </el-button>
          <el-button size="small" @click="agree(scope,0)" type="danger">不同意
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
          fixed="right"
          prop="icon"
          width="250"
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="toRefund(scope)" :disabled="scope.row.isPay === 0">退款</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="confirmBackBike(scope)" :disabled="scope.row.rentStatus !== 3">确认归还</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="editHandle(scope)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <template>
            <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope)">
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5,10]"
        :current-page="current"
        :page-size="size"
        :total="total">
    </el-pagination>

    <!--新增对话框-->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="600px"
        append-to-body
        :before-close="handleClose">
      <el-form :model="subBikeForm" :rules="subBikeFormRules" ref="subBikeForm">
        <el-form-item class="image_item" label="自行车图片" prop="image" style="width: 380px;">
          <Upload @getUrl="setUrl">
            <el-button slot="uploadBtn" type="primary" class="upload_btn">上传图片</el-button>
            <div slot="uploadBtn" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </Upload>
        </el-form-item>
        <el-form-item label="车名" prop="bikeName" label-width="100px">
          <el-input v-model="subBikeForm.bikeName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand" label-width="100px">
          <el-input v-model="subBikeForm.brand" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="停放位置" prop="address" label-width="100px">
          <el-input type="textarea" v-model="subBikeForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="车辆描述" prop="des" label-width="100px">
          <el-input type="textarea" v-model="subBikeForm.des" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="租金" prop="rentPrice" label-width="100px">
          <el-input type="text" v-model="subBikeForm.rentPrice" autocomplete="off" placeholder="元/小时" style="width: 200px"></el-input>
          <el-input type="text" v-model="subBikeForm.dayPrice" autocomplete="off" placeholder="元/天" style="width: 200px;margin-left: 10px"></el-input>
        </el-form-item>
        <el-form-item label="押金" prop="deposit" label-width="100px">
          <el-input type="text" v-model="subBikeForm.deposit" autocomplete="off" style="width: 200px"></el-input>元
        </el-form-item>
        <el-form-item label="租借状态" prop="rentStatus" label-width="100px">
          <el-radio-group v-model="subBikeForm.rentStatus">
            <el-radio :label="1">未出租</el-radio>
            <el-radio :label="0">已出租</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车辆状态" prop="bikeStatus" label-width="100px">
          <el-radio-group v-model="subBikeForm.bikeStatus">
            <el-radio :label="1">良好</el-radio>
            <el-radio :label="0">维修</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reSetEditForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--    退款-->
    <el-dialog
        title="退款"
        :visible.sync="refundDialogVisible"
        width="30%"
        append-to-body>
      <el-form :model="refundForm" ref="refundForm">
        <el-form-item label="退还租金" prop="rentPrice" label-width="100px">
          <el-input v-model="refundForm.rentPrice" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="退还押金" prop="deposit" label-width="100px">
          <el-input v-model="refundForm.deposit" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="注意" prop="des" label-width="100px">
          <el-input type="textarea" v-model="refundForm.tips" autocomplete="off" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="refund()">确 定</el-button>
      </div>
    </el-dialog>

    <!--    确认归还对话框-->
    <el-dialog
        title="确认归还"
        :visible.sync="backBikeDialog"
        width="30%"
        append-to-body
        center>
      <el-form ref="form" :model="backForm" label-width="120px" style="margin-right: 50px;">
        <el-form-item label="返还押金">
          <el-input v-model="backForm.deposit" readonly></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backBikeDialog = false">取 消</el-button>
        <el-button type="primary" @click="backBike()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Upload from "@/components/upload";

export default {
  name: "Bikes",
  components: {Upload},
  data() {
    return {
      searchForm: {},
      backBikeDialog:false,
      backForm:{},
      userId: 0,
      subBikeForm: {},
      bikes: [],
      total: 0,
      size: 4,
      current: 1,
      dialogVisible: false,
      delBtlStatus: true,
      refundDialogVisible: false,
      subBikeFormRules: {
        brand: [
          {required: true, message: '请输入车辆品牌', trigger: 'blur'}
        ],
        bikeName: [
          {required: true, message: '请输入车辆名称', trigger: 'blur'}
        ],
        rentStatus: [
          {required: true, message: '请输选择租借状态', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请写明车辆停放位置', trigger: 'blur'}
        ],
        rentPrice: [
          {required: true, message: '请输入租金', trigger: 'blur'}
        ],
        deposit: [
          {required: true, message: '请输入押金', trigger: 'blur'}
        ]
      },
      refundForm: {}
    }
  },
  created() {
    this.getBikeListByUserId();
    this.createWebSocket();
  },
  computed: {
    userInfo: {
      get() {
        return JSON.parse(sessionStorage.getItem("loginUserInfo"));
      }
    }
  },
  methods: {
    backBike(){
      this.$axios.post('/sys/bike/backDeposit/'+this.backForm.bikeRentId+"/"+this.backForm.deposit,).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.resCode === 2000){
            this.$notify({
              type: 'success',
              duration: 0,
              message: res.data.data.resMsg,
              showClose: true,
              onClose: () => {
                this.backBikeDialog = false;
                this.backForm = {};
                this.getBikeListByUserId();
              }
            })
          }
          if (res.data.data.resCode === 3000){
            this.$notify({
              type: 'warning',
              duration: 0,
              message: res.data.data.resMsg,
              showClose: true,
              onClose: () => {
                this.backBikeDialog = false;
                this.backForm = {};
                this.getBikeListByUserId();
              }
            })
          }
        }
        console.log("this.backForm=",this.backForm);
      }).catch(err => {
        console.log("err.data", err.data)
      })
    },
    confirmBackBike(){
      this.$nextTick(() => {
        this.$axios.get('/sys/bikeRent/returnBikeMsg').then(res => {
          if (res.data.code === 200) {
            this.backForm = res.data.data
          }
          this.backBikeDialog = true;
          console.log("this.backForm=",this.backForm);
        }).catch(err => {
          console.log("err.data", err.data)
        })
      })
    },
    toRefund(scope) {
      console.log("scope.row=", scope.row)
      let bikeId = scope.row.id;
      let hostId = scope.row.userId;
      let rentName = scope.row.rentName;
      this.$axios.get("/sys/bike/toRefund/" + bikeId + "/" + hostId + "/" + rentName)
          .then(res => {
            if (res.data.code === 200) {
              console.log("res.data=", res.data)
              this.refundForm.deposit = res.data.data.deposit;
              this.refundForm.rentPrice = res.data.data.rentPrice;
              this.refundForm.rentName = rentName;
              this.refundForm.bikeId = bikeId;
              this.refundForm.hostId = hostId;
              this.refundDialogVisible = true;
            }
          })
          .catch(err => {
          })
    },
    refund() {
      console.log("this.refundForm=", this.refundForm)
      this.$confirm('确定退款吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/sys/bike/refund', this.refundForm)
            .then(res => {
              if (res.data.code === 200) {
                if (res.data.data.resCode === 2001) {
                  this.$notify({
                    type: 'info',
                    duration: 0,
                    message: res.data.data.resMsg,
                    showClose: true,
                    onClose: () => {
                      this.getBikeListByUserId();
                    }
                  })
                }
                if (res.data.data.resCode === 2002) {
                  this.$notify({
                    type: 'success',
                    duration: 0,
                    message: res.data.data.resMsg,
                    showClose: true,
                    onClose: () => {
                      this.getBikeListByUserId();
                    }
                  })
                }
              }
            })
            .catch(err => {
            })
      }).catch(() => {
      });
    },
    // 与websocket服务器创建连接
    createWebSocket() {
      // 注意这里的端口号是后端服务的端口号，后面的是后端正常请求的路径，ziyuan是我的项目名，最后面的是我放在cookie中的当前登陆用户
      let websocket = new WebSocket('ws://localhost:8881/webSocket/' + this.userInfo.username);
      // 连接成功时
      websocket.onopen = () => {
        console.log('打开了')
      }
      websocket.onmessage = event => {
        // 后端发送的消息在event.data中
        this.$notify({
          showClose: true,
          message: event.data,
          type: 'success',
          duration: 0,
          onClose: () => {
            this.getBikeListByUserId();
          }
        });
      }
      setTimeout(()=>{
        websocket.onclose = function () {
          console.log('关闭了')
        }
      },100000)
      // 路由跳转时结束websocket链接
      this.$router.afterEach(function () {
        websocket.close()
      })
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
      window.onbeforeunload = function () {
        websocket.close()
      }
    },
    getBikeListByUserId() {
      this.$axios.get("/sys/bike/listByUser/" + this.userInfo.id, {
        params: {
          brand: this.searchForm.brand,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        console.log("/sys/bike/listByUser=", res.data.data.records)
        this.bikes = res.data.data.records
        this.total = res.data.data.total
        this.size = res.data.data.size
        this.current = res.data.data.current
      })
    },
    agree(scope, type) {
      if (scope.row.rentPhone === null || scope.row.rentName === "") {
        this.$notify({
          showClose: true,
          message: "该车辆暂未出租，此操作无效！",
          type: 'error',
          duration: 0,
        });
        return;
      }
      if (scope.row.isPay === 1) {
        this.$notify({
          showClose: true,
          message: "对方已支付租金，请先退还租金！",
          type: 'error',
          duration: 0,
        });
        return;
      }
      if (type === 1) {
        this.$axios.post('/sys/bike/agree/' + scope.row.id + "/" + type + "/" + scope.row.rentName)
            .then(res => {
              console.log("/sys/bike/agree->res.data=", res.data);
              if (res.data.code === 200) {
                this.$notify({
                  showClose: true,
                  message: res.data.data,
                  type: 'success',
                  duration: 0,
                  onClose: () => {
                    this.getBikeListByUserId();
                  }
                });
              }
            })
            .catch(err => {
            })
      } else if (type === 0) {
        if (scope.row.isPay === 1) {
          this.$notify({
            showClose: true,
            message: "对方已付款,请先退款！",
            type: 'success',
            duration: 0,
          });
          return;
        }
        this.$axios.post('/sys/bike/agree/' + scope.row.id + "/" + type+ "/" + scope.row.rentName)
            .then(res => {
              if (res.data.code === 200) {
                this.$notify({
                  showClose: true,
                  message: res.data.data,
                  type: 'success',
                  duration: 0,
                  onClose: () => {
                    this.getBikeListByUserId();
                  }
                });
              }
            })
            .catch(err => {

            })
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val
      this.getBikeListByUserId()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getBikeListByUserId()
    },
    handleSelectionChange(val) {
      console.log("handleSelectionChange->勾选")
      console.log(val)
      this.multipleSelection = val;
      this.delBtlStatus = val.length === 0;
    },
    delHandle(scope) {
      let ids = []
      if (scope) {
        if (scope.row.rentStatus === 0){
          this.$notify({
            showClose: true,
            message: "该自行车还未归还，请勿删除！",
            type: 'warning',
            duration: 0,
            onClose:()=>{
              this.getBikeListByUserId()
            }
          });
          return;
        }
        ids.push(scope.row.id)
      } else {
        this.multipleSelection.forEach(select => {
          if (select.rentStatus === 0){
            this.$notify({
              showClose: true,
              message: "车名为："+select.bikeName+"的自行车还未归还，请勿删除！",
              type: 'warning',
              duration: 0,
              onClose:()=>{
                this.getBikeListByUserId()
              }
            });
            return;
          }
          ids.push(select.id)
        })
      }
      this.$axios.post("/sys/bike/delete", ids).then(res => {
        this.getBikeListByUserId()
        this.$message({
          showClose: true,
          message: res.data.msg,
          type: 'success',
        });
      })
    },
    editHandle(scope) {
      if (scope.row.rentStatus === 0) {
        this.$notify({
          showClose: true,
          type: "info",
          message: "该车已出租,不可编辑",
          duration: 0,
        })
        return
      }
      this.$axios.get('/sys/bike/info/' + scope.row.id).then(res => {
        console.log("editHandle->/sys/bike/info/->editForm", res.data.data)
        this.subBikeForm = res.data.data.bikeInfo
        this.dialogVisible = true;
      })
    },
    handleClose() {
      this.$refs.subBikeForm.resetFields();
      this.dialogVisible = false
      this.subBikeForm = {}
      this.subBikeForm.image = null
    },
    setUrl(url) {
      console.log("url", url);
      this.subBikeForm.image = url
    },
    reSetEditForm() {
      this.$refs.subBikeForm.resetFields()
      this.dialogVisible = false
      this.subBikeForm = {}
      this.subBikeForm.image = null
    },
    submitForm() {
      this.$refs.subBikeForm.validate((valid) => {
        if (valid) {
          this.subBikeForm.userId = this.userId;
          this.$axios.post('/sys/bike/' + (this.subBikeForm.id ? 'update' : 'save'), this.subBikeForm)
              .then(res => {
                this.$notify({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                  onClose: () => {
                    this.getBikeListByUserId();
                  }
                });
                this.$refs.subBikeForm.resetFields();
                this.dialogVisible = false
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },

}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 20px;
}

.image_item {
  position: relative;
  margin-left: 30px;
}
</style>