<template>
  <el-card class="box-card">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="用户租车流程" name="1">
        <div style="font-weight: bold">
          <span>第一，浏览想要租借的自行车;</span> ——>
          <span>第二，点击去租车，进入对应自行车详情页，阅读租车协议;</span>——>
          <span>第三，选择租用时间，勾选我已阅读并同意租车协议;</span>——>
          <span>第四，提交租单(如果已经登录则直接提交，未登录请登录后在提交);</span>——>
          <span>第五，租单提交成功后，会跳转至个人租单页，租户需等待车主同意通知;</span>——>
          <span>第六，如果车主同意租车，则租户支付后去指定地点取车，不同意则请租户去查看其他可租用车辆;</span>
        </div>
      </el-collapse-item>
      <el-collapse-item title="反馈 Feedback" name="2">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
      <el-collapse-item title="效率 Efficiency" name="3">
        <div>简化流程：设计简洁直观的操作流程；</div>
        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
      </el-collapse-item>
      <el-collapse-item title="可控 Controllability" name="4">
        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
export default {
  name: "Help",
  data() {
    return {
      activeName: '0'
    };
  }
}
</script>

<style scoped>
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");
.el-card{
  opacity: 0.9;
  width: 1200px;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

/deep/ .el-collapse-item__header{
  font-size: 20px;
  font-weight: bold;
  color: cornflowerblue;
}
/deep/ .el-collapse-item__content{
}
</style>