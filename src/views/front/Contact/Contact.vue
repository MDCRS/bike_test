<template>
  <el-card class="box-card">
    <el-descriptions title="联系我们：" :column="2">
      <el-descriptions-item label="电话号码">15193836387</el-descriptions-item>
      <el-descriptions-item label="备注">
        <el-tag size="small">学校</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="联系地址">兰州理工大学</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script>
export default {
  name: "Contact"
}
</script>

<style scoped>
.el-card{
  opacity: 0.9;
  width: 1200px;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>