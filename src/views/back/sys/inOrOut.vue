<template>
  <el-tabs type="border-card">
<!--    充值-->
    <el-tab-pane label="充值记录">
      <el-form :inline="true">
        <el-form-item>
          <el-input
              v-model="chargeSearchForm.orderNum"
              placeholder="订单号"
              clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getChargeList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
          :data="chargeList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          stripe>
        <el-table-column
            label="订单号"
            prop="orderNo"
            align="center">
        </el-table-column>
        <el-table-column
            prop="paymentType"
            label="充值方式"
            align="center">
          <template slot-scope="scope">
            <el-tag size="small" type="info">{{scope.row.paymentType==='aliPay'?'支付宝充值':''}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="amount"
            align="center"
            label="金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}元</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="orderStatus"
            align="center"
            label="状态">
          <template slot-scope="scope">
            <el-tag size="small" type="info">{{scope.row.orderStatus==='SUCCESS'?'充值成功':''}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="created"
            align="center"
            label="充值时间">
        </el-table-column>
        <el-table-column
            width="120px"
            label="操作">
              暂无操作
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="chargeSizeChange"
          @current-change="chargeCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[4,8]"
          :current-page="chargeCurrent"
          :page-size="chargeSize"
          :total="chargeTotal">
      </el-pagination>
    </el-tab-pane>
<!--    收入-->
    <el-tab-pane label="收款记录">
      <el-form :inline="true">
        <el-form-item>
          <el-input
              v-model="inSearchForm.username"
              placeholder="付款用户名"
              clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getInList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
          :data="inList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          stripe>
        <el-table-column
            prop="payAmount"
            align="center"
            label="收入租金">
          <template slot-scope="scope">
            <span>{{scope.row.payAmount}}元</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="deposit"
            align="center"
            label="车辆押金">
          <template slot-scope="scope">
            <span>{{scope.row.deposit}}元</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="username"
            align="center"
            label="付款用户名">
        </el-table-column>
        <el-table-column
            prop="purpose"
            align="center"
            label="目的">
        </el-table-column>
        <el-table-column
            prop="payTime"
            align="center"
            label="支付时间">
        </el-table-column>
        <el-table-column
            width="120px"
            label="操作">
          暂无操作
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="inSizeChange"
          @current-change="inCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[4,8]"
          :current-page="inCurrent"
          :page-size="inSize"
          :total="inTotal">
      </el-pagination>
    </el-tab-pane>
<!--    支出-->
    <el-tab-pane label="付款记录">
      <el-form :inline="true">
        <el-form-item>
          <el-input
              v-model="outSearchForm.username"
              placeholder="收款用户名"
              clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getOutList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
          :data="outList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          stripe>
        <el-table-column
            prop="payAmount"
            align="center"
            label="支付租金">
          <template slot-scope="scope">
            <span>{{scope.row.payAmount}}元</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="deposit"
            align="center"
            label="支付押金">
          <template slot-scope="scope">
            <span>{{scope.row.deposit}}元</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="username"
            align="center"
            label="收款用户名">
        </el-table-column>
        <el-table-column
            prop="purpose"
            align="center"
            label="目的">
        </el-table-column>
        <el-table-column
            prop="payTime"
            align="center"
            label="支付时间">
        </el-table-column>
        <el-table-column
            width="120px"
            label="操作">
          暂无操作
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="outSizeChange"
          @current-change="outCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[4,8]"
          :current-page="outCurrent"
          :page-size="outSize"
          :total="outTotal">
      </el-pagination>
    </el-tab-pane>
  </el-tabs>
</template>

<script>

export default {

  name: "inOrOut",
  data(){
    return{
      //充值记录参数
      chargeSearchForm:{},
      chargeList:[],
      chargeCurrent:1,
      chargeSize:4,
      chargeTotal:0,
      //收入
      inSearchForm:{},
      inList:[],
      inCurrent:1,
      inSize:4,
      inTotal:0,
      //支出
      outSearchForm:{},
      outList:[],
      outCurrent:1,
      outSize:4,
      outTotal:0,
    }
  },
  created() {
    this.getChargeList();
    this.getInList();
    this.getOutList();
  },
  computed:{
    loginUserInfo:{
      get(){
         return this.$store.state.user.userInfo;
      }
    } 
  },
  methods:{
    //充值记录方法
    getChargeList(){
      this.$axios.get("/sys/user/chargeRecord/"+this.loginUserInfo.id, {
        params: {
          orderNum: this.chargeSearchForm.orderNum,
          current: this.chargeCurrent,
          size: this.chargeSize
        }
      }).then(res => {
        this.chargeList = res.data.data.records
        console.log("getChargeList->res.data.data.records=",res.data.data.records)
        this.chargeSize = res.data.data.size
        this.chargeCurrent = res.data.data.current
        this.chargeTotal = res.data.data.total
      })
    },
    chargeSizeChange(val){
      this.chargeSize = val
      this.getChargeList()
    },
    chargeCurrentChange(val){
      this.chargeCurrent = val
      this.getChargeList()
    },
    //收入
    getInList(){
      this.$axios.get("/sys/user/inRecord/"+this.loginUserInfo.id, {
        params: {
          rentUser: this.inSearchForm.username,
          current: this.inCurrent,
          size: this.inSize
        }
      }).then(res => {
        console.log("res.data.data.records=",res.data.data.records)
        this.inList = res.data.data.records
        this.inSize = res.data.data.size
        this.inCurrent = res.data.data.current
        this.inTotal = res.data.data.total
      })
    },
    inSizeChange(val){
      this.inSize = val
      this.getInList()
    },
    inCurrentChange(val){
      this.inCurrent = val
      this.getInList()
    },
    //支出
    getOutList(){
      this.$axios.get("/sys/user/outRecord/"+this.loginUserInfo.id, {
        params: {
          hostUser: this.outSearchForm.username,
          current: this.outCurrent,
          size: this.outSize
        }
      }).then(res => {
        this.outList = res.data.data.records
        this.outSize = res.data.data.size
        this.outCurrent = res.data.data.current
        this.outTotal = res.data.data.total
      })
    },
    outSizeChange(val){
      this.outSize = val
      this.getOutList()
    },
    outCurrentChange(val){
      this.outCurrent = val
      this.getOutList()
    }

  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 20px;
}
</style>