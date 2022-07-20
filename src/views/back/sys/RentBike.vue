<template>
  <div style="opacity: 0.9">
    <el-form :inline="true">
      <el-form-item>
        <el-input
            v-model="searchForm.hostName"
            placeholder="请输入车主名"
            clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getRentBikeList">搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatus">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table
        ref="multipleTable"
        :data="rentBikes"
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
          prop="hostName"
          label="车主名"
          align="center"
          width="120">
      </el-table-column>
      <el-table-column
          prop="hostPhone"
          label="车主联系方式"
          align="center"
          width="120">
      </el-table-column>
      <el-table-column
          prop="bikeName"
          label="车名"
          align="center"
          width="120">
      </el-table-column>
      <el-table-column
          prop="brand"
          label="品牌"
          align="center"
          width="120">
      </el-table-column>
      <el-table-column
          prop="rentPrice"
          label="租金"
          align="center"
          width="100">
        <template slot-scope="scope">
          {{ scope.row.rentPrice }}元
        </template>
      </el-table-column>
      <el-table-column
          prop="deposit"
          label="押金"
          align="center"
          width="100">
        <template slot-scope="scope">
          {{ scope.row.deposit }}元
        </template>
      </el-table-column>
      <el-table-column
          prop="startDate"
          label="租车开始时间"
          align="center"
          :formatter="formatDate"
          :show-overflow-tooltip="true"
          width="150">
      </el-table-column>
      <el-table-column
          prop="endDate"
          label="租车结束时间"
          align="center"
          :formatter="formatDate"
          :show-overflow-tooltip="true"
          width="150">
      </el-table-column>
      <el-table-column
          prop="isPay"
          width="120"
          align="center"
          label="是否同意">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.isAgree === 1" type="success">已同意</el-tag>
          <el-tag size="small" v-else-if="scope.row.isAgree === 0" type="danger">不同意</el-tag>
          <el-tag size="small" v-else-if="scope.row.isAgree === null" type="danger">暂未响应</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="isPay"
          width="120"
          align="center"
          label="是否支付">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.isPay === 1" type="success">已支付</el-tag>
          <el-tag size="small" v-else-if="scope.row.isPay === 0" type="danger">未支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="returnDate"
          label="还车时间"
          align="center"
          :formatter="formatDate"
          width="170">
        <template slot-scope="scope">
          {{ scope.row.returnDate === null ? "还未归还" : scope.row.returnDate }}
        </template>
      </el-table-column>
      <el-table-column
          fixed="right"
          prop="icon"
          align="center"
          width="200"
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="toPay(scope)"
                     :disabled="scope.row.isPay === 1 || scope.row.isAgree === 0 || scope.row.isAgree === null">支付
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <!--          希望值为true，-->
          <el-button type="text" @click="toCalTime(scope)" :disabled="scope.row.returnDate !== null">
            还车
          </el-button>
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
        :page-sizes="[4,8]"
        :current-page="current"
        :page-size="size"
        :total="total">
    </el-pagination>

    <!--    还车对话框-->
    <el-dialog
        title="还车"
        :visible.sync="backBikeDialog"
        width="30%"
        append-to-body
        center>
      <el-form ref="form" :model="backForm" label-width="120px" style="margin-right: 50px;">
        <el-form-item label="违约信息">
          <el-input type="textarea" v-model="backForm.defaultMsg" readonly></el-input>
        </el-form-item>
        <el-form-item label="扣除信用值">
          <el-input v-model="backForm.creditCount" readonly></el-input>
        </el-form-item>
        <el-form-item label="返还押金">
          <el-input v-model="backForm.deposit" readonly></el-input>
        </el-form-item>
        <el-form-item label="评价">
          <el-input type="textarea" v-model="backForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backBikeDialog = false">取 消</el-button>
        <el-button type="primary" @click="backBike()">确 定</el-button>
      </span>
    </el-dialog>

    <!--    支付租金对话框-->
    <el-dialog
        title="支付租金及押金"
        :visible.sync="payRentDialog"
        width="30%"
        append-to-body
        center>
      <el-form ref="form" :model="payBikeInfo" label-width="120px" style="margin-right: 50px;">
        <el-form-item label="租金">
          <el-input type="textarea" v-model="payBikeInfo.rentNum" readonly></el-input>
        </el-form-item>
        <el-form-item label="押金">
          <el-input v-model="payBikeInfo.deposit" readonly></el-input>
        </el-form-item>
        <el-form-item label="注意">
          <el-input type="textarea" v-model="payBikeInfo.tips" readonly></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payRentDialog = false">取 消</el-button>
        <el-button type="primary" @click="payRent()">确定支付</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {formatDate} from "@/utils";

export default {
  name: "RentBike",
  data() {
    return {
      searchForm: {},
      dialogVisible: false,
      payRentDialog: false,
      delBtlStatus: true,
      total: 0,
      size: 4,
      current: 1,
      rentBikes: [],
      backBikeDialog: false,
      backForm: {},
      payBikeInfo: {
        tips: "系统会根据您是否按照租车期限还车，扣除信用值的同时，按照您的违约时间扣除押金。请及时还车！"
      }
    }
  },
  created() {
    this.getRentBikeList();
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
    // 与websocket服务器创建连接
    createWebSocket() {
      // 注意这里的端口号是后端服务的端口号，后面的是后端正常请求的路径，ziyuan是我的项目名，最后面的是我放在cookie中的当前登陆用户
      var websocket = new WebSocket('ws://localhost:8881/webSocket/' + this.userInfo.username);
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
            this.getRentBikeList();
          }
        });
      }
      websocket.onclose = function () {
        console.log('关闭了')
      }
      // 路由跳转时结束websocket链接
      this.$router.afterEach(function () {
        websocket.close()
      })
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
      window.onbeforeunload = function () {
        websocket.close()
      }
    },
    getRentBikeList() {
      this.$axios.get('/sys/bikeRent/list', {
        params: {
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.rentBikes = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    // 时间格式方法
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property]
      return formatDate(data)
    },
    toPay(scope) {
      if (scope.row.isPay === 1) {
        return;
      }
      this.payBikeInfo.rentNum = scope.row.rentPrice;
      this.payBikeInfo.deposit = scope.row.deposit;
      this.payBikeInfo.rentBikeId = scope.row.id;
      this.payBikeInfo.isAgree = scope.row.isAgree;
      this.payRentDialog = true;
    },
    payRent() {
      if (this.payBikeInfo.isAgree === 0) {
        this.$notify({
          showClose: true,
          message: "车主还未同意向您租界此车，请先不要支付！",
          type: 'warning',
          duration: 0,
          onClose: () => {
            this.getRentBikeList();
            this.payRentDialog = false;
          }
        });
        return;
      }
      this.$axios.post('/sys/bikeRent/payRent', this.payBikeInfo)
          .then(res => {
            if (res.data.code === 200) {
              this.$notify({
                showClose: true,
                message: res.data.data,
                type: 'success',
                duration: 0,
                onClose: () => {
                  this.getRentBikeList();
                  this.payRentDialog = false;
                }
              });
            }
          })
          .catch(err => {
          })
    },
    delHandle(scope) {
      let ids = []
      if (scope) {
        if (scope.row.returnDate === null) {
          this.$notify({
            showClose: true,
            message: "该自行车还未归还，请勿删除！",
            type: 'warning',
            duration: 0,
            onClose: () => {
              this.getRentBikeList();
            }
          });
          return;
        }
        ids.push(scope.row.id)
      } else {
        this.multipleSelection.forEach(select => {
          if (select.returnDate === null) {
            this.$notify({
              showClose: true,
              message: "车名为：" + select.bikeName + "的自行车还未归还，请勿删除！",
              type: 'warning',
              duration: 0,
              onClose: () => {
                this.getRentBikeList();
              }
            });
            return;
          }
          ids.push(select.id)
        })
      }
      this.$axios.post("/sys/bikeRent/delete", ids).then(res => {
        this.getRentBikeList()
        this.$message({
          showClose: true,
          message: res.data.msg,
          type: 'success',
        });
      })
    },
    handleSelectionChange(val) {
      console.log("handleSelectionChange->勾选")
      console.log(val)
      this.multipleSelection = val;
      console.log("this.multipleSelection=", this.multipleSelection)
      this.delBtlStatus = val.length === 0;
    },
    toCalTime(scope) {
      let rentBike = scope.row
      if (scope.row.isPay === 0) {
        this.$notify({
          showClose: true,
          type: "warning",
          message: "您还没有支付!",
          during: 0,
          onClose: () => {
            this.getRentBikeList();
          }
        })
        return;
      }
      this.$nextTick(() => {
        //1.计算endDate 和 returnDate 之间的关系；2. 计算返还的押金以及要扣除的信用值
        this.$axios.get('/sys/bikeRent/calTime', {
          params: {
            rentBikeId: rentBike.id,
            deposit: rentBike.deposit,
            endDate: rentBike.endDate,
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.backForm.creditCount = res.data.data.data.creditCount
            this.backForm.deposit = res.data.data.data.deposit
            this.backForm.defaultMsg = res.data.data.data.defaultMsg
            this.backForm.bikeRentId = res.data.data.data.rentBikeId
          }
          this.backBikeDialog = true;
          console.log("this.backForm=", this.backForm);
        }).catch(err => {
          console.log("err.data", err.data)
        })
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val
      this.getRentBikeList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getRentBikeList()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    backBike() {
      console.log("backBike->this.backForm=", this.backForm)
      let _this = this;
      this.$axios.post('/sys/bikeRent/backBike', this.backForm)
          .then(res => {
            console.log("res.data=", res.data);
            if (res.data.code === 200) {
              this.backBikeDialog = false;
              this.$notify({
                showClose: true,
                type: "success",
                message: res.data.data.data,
                during: 0,
                onClose() {
                  _this.getRentBikeList();
                }
              })
            }
          })
          .catch(err => {
            console.log("err.data=", err.data);
            console.log("err.data=", "还车请求失败！");
          })
    },
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 20px;
}
</style>