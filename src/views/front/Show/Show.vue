<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="19">
        <div class="grid-content bg-purple">
          <div class="my_search">
            <el-form :inline="true">
              <el-form-item>
                <el-input
                    v-model="searchForm.bikeName"
                    placeholder="请输入车名"
                    clearable
                >
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="getBikeInfo">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-card class="card_div" v-for="bike in bikes" :key="bike.id">
            <img :src="bike.image"
                 class="image" @click="toDetail(bike.id)" alt="图片">
            <div class="text_div">
              <span style="font-size: 13px">品牌：{{ bike.brand }}</span> <br>
              <span style="font-size: 13px">车名：{{ bike.bikeName }}</span> <br>
              <div class="bottom clearfix">
                <span class="time" style="margin-right: 10px">被租次数：{{ bike.rentCount }}</span>
                <el-popover
                    placement="top-start"
                    title="租车详情说明"
                    width="200"
                    trigger="hover"
                    :content="bike.des"
                    class="popover_div">
                  <el-button slot="reference" class="detail_btn">查看租车说明</el-button>
                </el-popover>
                <el-button type="text" class="button_go_lend" @click="toDetail(bike.id)" :disabled="disabled">去租车</el-button>
              </div>
            </div>
          </el-card>
          <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="current"
                :page-size="size"
                layout="total, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="calender_div">
            <DatePicker class="date_picker" v-model="currentDate"></DatePicker>
          </div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold">租车推荐</span>
            </div>
            <div v-for="bike in orderBikes" :key="bike.id" class="text item">
              {{bike.bikeName}}被租:<span style="font-weight: bold">{{bike.rentCount}}</span>次
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

export default {
  name: "Show",
  components: {DatePicker},
  data() {
    return {
      currentDate: new Date(),
      total: 0,
      size: 4,
      current: 1,
      searchForm: {},
      bikes: [],
      orderBikes: [],
      readTheAgreement: false,
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      isFlag: true,
      disabled:false
    }
  },
  computed:{
    userInfo:{
      get(){
          return this.$store.state.user.userInfo
      }
    }
  },
  created() {
    this.getBikeInfo()
    this.getOrderBikes()
    this.talkToUser()
  },
  methods: {
    talkToUser(){
      if (this.userInfo.creditValue<=0){
        this.readTheAgreement = true;
        this.disabled = true;
      }
    },
    toDetail(id) {
      if (this.userInfo.creditValue<=50){
        this.$notify({
          showClose:true,
          type:"warning",
          message:"您的信用值不足！",
          duration:0,
        })
        return;
      }
      this.$router.push({name: "FrontNavDetail", params: {id: id}})
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val
      this.getBikeInfo()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getBikeInfo()
    },
    getBikeInfo() {
      this.$axios.get("/sys/bike/list", {
        params: {
          bikeName: this.searchForm.bikeName,
          rent_status: 1,
          bike_status: 1,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.bikes = res.data.data.records
        this.total = res.data.data.total
        this.size = res.data.data.size
        this.current = res.data.data.current
      })
    },
    getOrderBikes() {
      this.$axios.get('/sys/bike/orderBikes',{
        params: {
          rent_status:1,
          bike_status:1
        }
      })
          .then(res => {
            if (res.data.code === 200) {
              this.orderBikes = res.data.data
            }
          })
          .catch(err => {
            
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
  background-color: #f9fafc;
}

.card_div {
  position: relative;
  width: 240px;
  height: 400px;
  margin-bottom: 20px;
  margin-right: 20px;
  display: inline-block;
}

.image {
  width: 200px;
  height: 200px;
  margin-bottom: 30px;
  border-radius: 5px;
  box-shadow: 0 0 10px gray;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.time {
  font-size: 13px;
  color: #999;
}


.button_go_lend {
  position: relative;
  padding: 5px;
  float: right;
  margin-top: 45px;
}

.detail_btn {
  color: dodgerblue;
  width: 120px;
}

.popover_div {
  position: relative;
  float: left;
  margin-top: 35px;

}

.text_div {
  display: inline-block;
}

.calender_div {
  position: relative;
  width: 100%;
  height: 50%;
}

.my_search {
  position: relative;
  margin-right: 600px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 88%;
  margin-left: 15px;
  margin-top: 5px;
}

.order_title {
  margin-right: 120px;
  font-weight: bold;
}
</style>