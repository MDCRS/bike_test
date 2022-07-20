<template>
  <el-container>
    <el-header>
      <Strong>校园自行车后台中心</Strong>
      <div class="header-avatar block">
        <el-row>
          <el-col :span="8">
            <el-avatar class="avatar_me" size="medium" :src="userInfo.avatar"></el-avatar>
          </el-col>
          <el-col :span="16">
            <el-dropdown>
                <span class="el-dropdown-link">
                  {{ userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :underline="false">
                  <router-link to="/uc">个人中心</router-link>
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <SideMenu></SideMenu>
      </el-aside>
      <el-main>
        <div>
          <Tabs></Tabs>
          <div style="margin: 0 15px">
            <router-view></router-view>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from '@/views/back/SideMenu/SideMenu'
import Tabs from "@/views/back/Tabs/Tabs"

export default {
  name: "BackNav",
  components: {SideMenu, Tabs},
  computed: {
    userInfo: {
      get() {
        return this.$store.state.user.userInfo;
      }
    }
  },
  methods: {
    logout() {
      this.$axios.post("/logout").then(res => {
        localStorage.clear()
        sessionStorage.clear()
        this.$store.commit("resetState")
        this.$router.push("/front/frontHome")
      })
    },
  }
}
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100%;
}

.header-avatar {
  float: right;
  width: 150px;
}

.avatar_me {
  margin-top: 15px;
}


.el-dropdown-link {
  cursor: pointer;
}

.el-header {
  background-color: #17B3A3;
  color: #333;
  text-align: center;
  line-height: 65px;
  height: 65px !important;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
}

.el-main {
  color: #333;
  padding: 0
}

a {
  text-decoration: none;
}
</style>