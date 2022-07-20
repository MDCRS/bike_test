<template>
  <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
    <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name">
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "Tabs",
  data() {
    return {
    }
  },
  computed:{
    editableTabs:{
      get(){
        return this.$store.state.user.editableTabs;
      },
      set(val){
        this.$store.state.user.editableTabs = val;
      }
    },
    editableTabsValue:{
      get(){
        return this.$store.state.user.editableTabsValue;
      },
      set(val){
        this.$store.state.user.editableTabsValue = val;
      }
    }
  },
  methods: {
    clickTab(target){
      this.$router.push({name:target.name})
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;

      if (activeName === 'BackNavIndex'||tabs.length === 1) {
        return
      }
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      this.$router.push({name: activeName})
    },
  }
}
</script>

<style scoped>
.el-tabs{
  color: #333333;
}
</style>