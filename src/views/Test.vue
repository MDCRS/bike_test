<template>
<!--      <el-dialog-->
<!--          title="提示"-->
<!--          :visible.sync="readTheAgreement"-->
<!--          width="30%"-->
<!--          :show-close="false"-->
<!--          center>-->

<!--        <div class="scroll-view" ref="scrollView" id="scroll-view" @scroll="scroll">-->
<!--          <div v-for="(item, index) in list" :key="index" class="list-item">-->
<!--            条款内容{{ item }}-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="btn">-->
<!--          <el-button :disabled="isFlag" @click="readTheAgreement = false">已阅读,下一步</el-button>-->
<!--        </div>-->
<!--      </el-dialog>-->
  <select v-model="unit" @change="test"  style="width: 100px;margin-left: 20px">
    <option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
    </option>
  </select>
</template>

<script>
export default {
  name: "Test",
  created() {
    this.readTheAgreement = true;
  },
  data(){
    return{
      readTheAgreement: false,
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      isFlag: true,
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
  methods:{
    test(){
      alert(this.unit)
    },
    scroll(e) {
      console.log("e-->=", e)
      const {scrollTop, clientHeight, scrollHeight} = e.target;
      console.log("scrollTop",scrollTop);
      console.log("clientHeight",clientHeight);
      console.log("scrollHeight",scrollHeight);
      console.log("scrollTop+clientHeight",scrollTop+clientHeight);
      console.log("((scrollTop + clientHeight) | 0)",((scrollTop + clientHeight) | 0));

      if (((scrollTop + clientHeight) | 0) === (scrollHeight-1)) {
        this.isFlag = false;
      }
    },
  }
}
</script>

<style scoped>
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
</style>