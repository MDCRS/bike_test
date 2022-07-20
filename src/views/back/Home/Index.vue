<template>
  <div>
    <h1>欢迎登录！{{ userInfo.username }} 同学</h1>
    <div v-if="hasAuth('sys:manage')">
      <el-row style="background-color: #ffffff;height: 140px;margin-bottom: 10px">
        <div class="userSta" ref="userSta"></div>
        <div class="bikeSta" ref="bikeSta"></div>
        <div class="profitSta" ref="profitSta"></div>
      </el-row>
      <el-row style="background-color: #ffffff;height: 140px">
        <div ref="bikeChat" class="bc"></div>
      </el-row>
    </div>
  </div>

</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "Index",
  mounted() {
    this.getBikeStatistic();
    this.$nextTick(() => {
      this.initBikeChat();
      this.initUserSumChart();
      this.initBikeSumChart();
      this.initProfitChart();
    })
  },
  methods: {
    getBikeStatistic() {
      this.$axios.get('/sys/bike/bikeStatistic').then(res => {
        if (res.data.code === 200) {
          this.$store.commit('saveBrandName', res.data.data.brandName);
          this.$store.commit('saveBrandCount', res.data.data.brandCount);
          this.$store.commit('saveRentCount', res.data.data.rentCount);
          this.$store.commit('saveUserSum', res.data.data.userSum);
          this.$store.commit('saveBikeSum', res.data.data.bikeSum);
          this.$store.commit('saveProfit', res.data.data.profit);
        }
      })
    },
    initBikeChat() {
      let bikeChat = echarts.init(this.$refs.bikeChat);
      let option = {
        title: {
          text: '自行车信息统计',
          subtext: 'num'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['车辆数', '租借次数']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            // prettier-ignore  ['Grant', '喜德盛', '美利达', '凤凰']
            data: this.brandName
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '车辆数',
            type: 'bar',
            //[2.0, 4.9, 7.0, 23.2]
            data: this.brandCount,
            markPoint: {
              data: [
                {type: 'max', name: 'Max'},
                {type: 'min', name: 'Min'}
              ]
            },
            markLine: {
              data: [{type: 'average', name: 'Avg'}]
            }
          },
          {
            name: '租借次数',
            type: 'bar',
            //[2.6, 5.9, 9.0, 26.4]
            data: this.rentCount,
            markPoint: {
              data: [
                // { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
                // { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
                {type: 'max', name: 'Max'},
                {type: 'min', name: 'Min'}
              ]
            },
            markLine: {
              data: [{type: 'average', name: 'Avg'}]
            }
          }
        ]
      }
      bikeChat.setOption(option);
    },
    initUserSumChart() {
      let userChart = echarts.init(this.$refs.userSta);
      // 重点代码
      let options = {
        title: {
          text: "用户数据：",
          left: 10,
          top: 10,
          textStyle:{
            color:'white'
          }
        },
        series: [
          {
            type: "pie",
            radius: [40, 50],
            hoverAnimation: false,
            labelLine: {show: false},
            center: ['65%', '50%'],//中心点坐标
            label: {
              position: 'center',
              color: '#5571C6FF'
            },
            data: [
              {
                name: "用户总数：\n" + this.userSum + "人",
                value: this.userSum,
                itemStyle: {
                  color: '#5571C6FF'
                }
              },
              {
                value: this.userSum % 5,
                itemStyle: {
                  color: 'white'
                }
              }
            ]
          }
        ]
      };
      userChart.setOption(options);
    },
    initBikeSumChart() {
      let bikeSta = echarts.init(this.$refs.bikeSta);
      // 重点代码
      let options = {
        title: {
          text: "自行车数据：",
          left: 10,
          top: 10,
          textStyle:{
            color:'white'
          }
        },
        series: [
          {
            type: "pie",
            radius: [40, 50],
            hoverAnimation: false,
            labelLine: {show: false},
            center: ['65%', '50%'],//中心点坐标
            label: {
              position: 'center',
              color: '#92cc76'
            },
            data: [
              {
                name: "车辆总数：\n" + this.bikeSum + "辆",
                value: this.bikeSum,
                itemStyle: {
                  color: '#92cc76'
                }
              },
              {
                value: this.bikeSum % 5,
                itemStyle: {
                  color: 'white'
                }
              }
            ]
          }
        ]
      };
      bikeSta.setOption(options);
    },
    initProfitChart() {
      let profitSta = echarts.init(this.$refs.profitSta);
      // 重点代码
      let options = {
        title: {
          text: "系统收益：",
          left: 10,
          top: 10,
          textStyle:{
            color:'white'
          }
        },
        series: [
          {
            type: "pie",
            radius: [40, 50],
            hoverAnimation: false,
            labelLine: {show: false},
            center: ['65%', '50%'],//中心点坐标
            label: {
              position: 'center',
              color: '#cc7676'
            },
            data: [
              {
                name: "总金：\n" + this.profit + "元",
                value: this.profit,
                itemStyle: {
                  color: '#ccbb76'
                }
              },
              {
                value: this.profit / 5,
                itemStyle: {
                  color: 'white'
                }
              }
            ]
          }
        ]
      };
      profitSta.setOption(options);
    },
  },
  computed: {
    userInfo: {
      get() {
        return this.$store.state.user.userInfo;
      }
    },
    userSum: {
      get() {
        return this.$store.state.user.userSum;
      },
      set(val) {
        this.$store.state.user.userSum = val;
      }
    },
    bikeSum: {
      get() {
        return this.$store.state.user.bikeSum;
      }
    },
    brandName: {
      get() {
        return this.$store.state.user.brandName;
      },
      set(val) {
        this.$store.state.user.brandName = val;
      }
    },
    brandCount: {
      get() {
        return this.$store.state.user.brandCount;
      },
      set(val) {
        this.$store.state.user.brandCount = val;
      }
    },
    rentCount: {
      get() {
        return this.$store.state.user.rentCount;
      },
      set(val) {
        this.$store.state.user.rentCount = val;
      }
    },
    profit: {
      get() {
        return this.$store.state.user.profit;
      },
      set(val) {
        this.$store.state.user.profit = val;
      }
    }
  },
}
</script>

<style scoped>
h1 {
  margin-right: auto;
  margin-left: auto;
}

.profitSta{
  height: 140px;
  width: 250px;
  box-shadow: 2px 10px 10px gray;
  border-radius: 5px;
  margin-left: 20px;
  background-color: #76ccb2;
  display: inline-block;
}
.userSta {
  height: 140px;
  width: 250px;
  box-shadow: 2px 10px 10px gray;
  border-radius: 5px;
  background-color: #92cc76;
  display: inline-block;
}

.bikeSta {
  height: 140px;
  width: 250px;
  margin-left: 20px;
  background-color: #17B3A3;
  box-shadow: 2px 10px 10px #888888;
  border-radius: 5px;
  display: inline-block;
}

.bc {
  height: 360px;
  width: 800px;
  box-shadow: 5px 10px 10px #888888;
  border-radius: 5px;
  display: inline-block;
}
</style>